const game = require('../socket');
const GameProvider = require('./game-provider');
const RoomProvider = require('../rooms/room-provider');

game.on('connection', (socket) => {
    // 게임방에 접속되어있는 유저 닉네임 리스트 전달
    socket.on('userNickname', async (roomNum) => {
        const userList = await RoomProvider.getCurrentMember(roomNum);
        socket.emit('userNickname', userList);
    });

    // 스파이 투표 중 스파이 유저 선택.
    socket.on('voteSpy', async (roomNum, nickname) => {
        try {
            socket.voteSpy = nickname;
            await GameProvider.setVoteResult(roomNum, nickname);
            const [currCount, roomUsers] = await GameProvider.currVoteCount(roomNum);
            if (Number(currCount) === Number(roomUsers)) {
                const result = await GameProvider.getVoteResult(roomNum);
                console.log(result);
                game.sockets.in(`/gameRoom${roomNum}`).emit('spyWin', result);
            }
        } catch (err) {
            console.log(err.message);
            socket.emit('error', (err.statusCode ??= 500), err.message);
        }
    });

    // 스파이 투표 종료 후 개인 결과 집계.
    socket.on('voteRecord', async (roomNum, nickname) => {
        try {
            // 현재 게임에서 스파이의 닉네임 찾기.
            const spyUser = await GameProvider.getSpy(roomNum);

            // 유저가 투표에서 스파이를 지목했다면 DB에 스파이 맞춘 횟수 증가.
            if (socket.voteSpy === spyUser) {
                await GameProvider.catchSpy(nickname);
            }

            // 유저의 게임 플레이 횟수 증가.
            await GameProvider.setPlayCount(nickname);

            // redis에 각 방의 투표 내용 socket별로 저장.
            // await GameProvider.setVoteResult(roomNum, socket.voteSpy);
        } catch (err) {
            socket.emit('error', (err.statusCode ??= 500), err.message);
        }
    });

    // 투표 결과 스파이가 이겼는지 졌는지에 대한 결과값
    // socket.on('spyWin', async (roomNum) => {
    //     try {
    //         const result = await GameProvider.getVoteResult(roomNum);
    //         console.log(result);
    //         socket.emit('endGame', result);
    //     } catch (err) {
    //         socket.emit('error', (err.statusCode ??= 500), err.message);
    //     }
    // });

    // 스파이가 제시어를 맞췄는지에 대한 결과값
    socket.on('spyGuess', async (roomNum, word, nickname) => {
        try {
            const result = await GameProvider.getGuessResult(roomNum, word, nickname);
            console.log(word, result);
            game.sockets.in(`/gameRoom${roomNum}`).emit('endGame', result);
        } catch (err) {
            console.log(err.message);
            socket.emit('error', (err.statusCode ??= 500), err.message);
        }
    });

    // nowVote 세팅.
    socket.on('setNowVote', async (roomNum) => {
        try {
            await GameProvider.setNowVote(roomNum);
            const currGameUsers = await GameProvider.getGameRoomUsers(roomNum);
            socket.in(`/gameRoom${roomNum}`).emit('setNowVote', currGameUsers);
        } catch (err) {
            console.log(err.message);
            socket.emit('error', (err.statusCode ??= 500), err.message);
        }
    });

    // 게임 진행 중 스파이 투표 찬반 투표 실행.
    socket.on('nowVote', async (roomNum, voteStatus, nickname) => {
        try {
            const [max, curr] = await GameProvider.nowVote(roomNum, voteStatus);

            // 본인의 nickname, 현재 nowVote 를 누른 인원 수
            game.sockets.in(`/gameRoom${roomNum}`).emit('nowVote', {
                nickname: nickname,
                currNowVoteCount: curr,
                currGameRoomUsers: max,
            });
        } catch (err) {
            console.log(err.message);
            socket.emit('error', (err.statusCode ??= 500), err.message);
        }
    });

    //스파이 선택
    socket.on('selectSpy', async (roomNum) => {
        try {
            //특정 클라이언트 빼고 모든 클라이언트에게 메시지 전송
            const spy = await GameProvider.selectSpy(roomNum);
            game.to(`/gameRoom${roomNum}`).sockets.emit('catch the spy', spy);
        } catch (err) {
            socket.emit('error', (err.statusCode ??= 500), err.message);
        }
    });

    //카테고리 & 정답단어 보여주기 //선택된 카테고리 단어 보여주기
    socket.on('giveWord', async (roomNum) => {
        try {
            const gameData = await GameProvider.giveWord(roomNum);
            socket.gameData = gameData;
            socket.emit('giveWord', gameData);
        } catch (err) {
            console.log(err.message);
            socket.emit('error', (err.statusCode ??= 500), err.message);
        }
    });
});
