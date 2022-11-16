const game = require('../socket');
const GameProvider = require('./game-provider');

game.on('connection', (socket) => {
    // 스파이 투표 중 스파이 유저 선택.
    socket.on('voteSpy', (nickname) => {
        // fn -> [FE]지목당한 nickname의 숫자를 1 증감 시켜주는 액션.
        // 유저 별로 실시간 자기가 지목당한 카운트를 표시한다.
        // fn(nickname);

        // 지목한 사람(socket)한테 지목당한 사람(nickname)의 정보를 담는다.
        // 투표가 끝나고 나서 socket.voteSpy안에 스파이의 nickname을 갖고있는 사람은 스파이를 찾는데 성공.
        socket.voteSpy = nickname;
    });

    // 스파이 투표 종료 후 개인 결과 집계.
    socket.on('voteRecord', async (roomNum) => {
        // 현재 게임에서 스파이의 닉네임 찾기.
        const spyUser = await GameProvider.getSpy(roomNum);

        // 유저가 투표에서 스파이를 지목했다면 DB에 스파이 맞춘 횟수 증가.
        if (socket.voteSpy === spyUser) {
            await GameProvider.catchSpy(socket.nickname);
        }

        // 유저의 게임 플레이 횟수 증가.
        await GameProvider.setPlayCount(socket.nickname);

        // redis에 각 방의 투표 내용 socket별로 저장.
        await GameProvider.setVoteResult(roomNum, socket.voteSpy);

        // redis 에 각 유저의 닉네임 저장
        await GameProvider.setRoomUsers(roomNum, socket.nickname);
    });

    // 게임 결과 집계.
    socket.on('endGame', async (roomNum) => {
        const gameResult = await GameProvider.getResult(roomNum);
        console.log(gameResult);
        socket.to(`/gameRoom${roomNum}`).emit('endGame', gameResult);
    });

    // 게임 진행 중 스파이 투표 찬반 투표 실행.
    socket.on('nowVote', async () => {});

    // 스파이 투표 찬반 집계.
    socket.on('', async () => {});

    //스파이 선택
    socket.on('selectSpy', async (nickname) => {
        socket.emit('selectSpy', await GameProvider.selectSpy(nickname));
    });

    //정답 단어 보여주기
    socket.on('giveWord', async (word) => {
        socket.emit('giveWord', await GameProvider.giveWord(word));
    });

    //카테고리 & 단어 막무가내로 보여주기
    socket.on('giveExample', async (category, word) => {
        socket.emit('giveExample', await GameProvider.giveExample(category, word));
    });

    //발언권 지목
    socket.on('micToss', async (nickname) => {
        socket.emit('micToss', await GameProvider.micToss(nickname));
    });
});
