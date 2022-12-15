const GameRepo = require('./game-repo');
const RoomRepo = require('../rooms/room-repo');
const redis = require('../redis');
const shuffle = require('shuffle-array');
const { SetError } = require('../middlewares/exception');

class GameProvider {
    getGameRoomUsers = async (roomNum) => {
        return await GameRepo.getRoomCurrentCount(roomNum);
    };

    getSpy = async (roomNum) => {
        if (isNaN(roomNum)) {
            throw new SetError('유효하지 않은 방 번호 입니다.', 400);
        }
        return await GameRepo.getSpy(roomNum);
    };

    catchSpy = async (nickname) => {
        await GameRepo.catchSpy(nickname);
    };

    setPlayCount = async (nickname) => {
        await GameRepo.setPlayCount(nickname);
    };

    setVoteResult = async (roomNum, nickname) => {
        await redis.lpush(`gameRoom${roomNum}Result`, nickname);
    };

    currVoteCount = async (roomNum) => {
        await redis.incr(`voteCount${roomNum}`);
        const count = await redis.get(`voteCount${roomNum}`);
        const roomUsers = await RoomRepo.currentCount(roomNum);
        return [count, roomUsers];
    };

    getVoteResult = async (roomNum) => {
        // 투표 집계한 배열.
        const resultList = await redis.lrange(`gameRoom${roomNum}Result`, 0, -1);
        // 방에 참여 중인 유저 닉네임.
        const roomUsers = await redis.lrange(`gameRoom${roomNum}Users`, 0, -1);
        if (resultList.length !== roomUsers.length) {
            throw new SetError('투표를 하지 않은 유저가 있습니다.', 400);
        }
        // spy 유저인 닉네임.
        const spyUser = await GameRepo.getSpy(roomNum);

        // 게임이 끝난 후 redis 메모리 정리.
        await redis.del(`gameRoom${roomNum}Result`);
        await redis.del(`gameRoom${roomNum}Users`);

        // 가장 표를 많이 받은 사람의 ['nickname', 투표받은 수]
        let maxVoteUser = ['', 0];

        for (let user of roomUsers) {
            let count = 0;
            resultList.forEach((vote) => {
                if (vote === user) count++;
            });
            if (count >= maxVoteUser[1]) {
                if ((user === spyUser || maxVoteUser[0] === spyUser) && count === maxVoteUser[1]) {
                    maxVoteUser[0] = user === spyUser ? maxVoteUser[0] : user;
                    maxVoteUser[1] = count;
                } else {
                    maxVoteUser[0] = user;
                    maxVoteUser[1] = count;
                }
            }
        }
        // 가장 많이 표를 받은 사람이 spy 면 true, 아니면 false return.
        return !(maxVoteUser[0] === spyUser);
    };

    getGuessResult = async (roomNum, word, nickname) => {
        const roomData = await RoomRepo.getRoom(roomNum);
        if (roomData.gameWord === null) {
            throw new SetError('게임방 제시어 설정이 되어있지 않습니다.', 500);
        }

        if (roomData.gameWord === word) {
            await GameRepo.setSpyWinCount(nickname);
        }
        return roomData.gameWord === word;
    };

    // 각 방에 참여한 유저들의 닉네임 저장.
    setRoomUsers = async (roomNum, nickname) => {
        // roomUsers 에 유저들 닉네임 추가
        await redis.rpush(`gameRoom${roomNum}Users`, [nickname]);
    };

    // nowVote 배열 생성.
    setNowVote = async (roomNum) => {
        if (!isNaN(roomNum)) {
            throw new SetError('유효하지 않은 방 번호 입니다.', 400);
        }
        await redis.set(`nowVote${roomNum}`, 0);
    };

    // nowVote 에 1++ / 1--
    nowVote = async (roomNum, voteStatus) => {
        if (Number(voteStatus)) {
            await redis.incr(`nowVote${roomNum}`);
        } else {
            await redis.decr(`nowVote${roomNum}`);
        }
        const currNowVote = await redis.get(`nowVote${roomNum}`);
        const roomCurrentCount = await GameRepo.getRoomCurrentCount(roomNum);
        return [roomCurrentCount, currNowVote];
    };

    // 스파이 랜덤 설정
    selectSpy = async (roomNum) => {
        const exist = await redis.exists(`gameRoom${roomNum}Users`);
        if (!exist) {
            throw new SetError('방에 참여한 멤버의 정보가 없습니다.', 500);
        }
        let getAllNickname = await redis.lrange(`gameRoom${roomNum}Users`, 0, -1);

        const shuffleList = shuffle(getAllNickname);
        const spy = shuffleList.pop();

        //스파이 저장
        await GameRepo.setSpy(roomNum, spy);
        return spy;
    };

    giveWord = async (roomNum) => {
        //category 랜덤으로 출력
        const exists = await redis.exists('allCategory');
        if (exists !== 1) {
            const allCategory = await GameRepo.giveCategory();
            await redis.lpush('allCategory', allCategory);
        }
        const givecategory = await redis.lrange('allCategory', 0, -1);

        let categoryFix = shuffle(givecategory).pop();

        //mongoose 에 있는 카테고리
        const showWords = await GameRepo.giveWord(categoryFix);
        const answerWord = shuffle(showWords).pop();
        await GameRepo.setGameWord(roomNum, answerWord);
        showWords.push(answerWord);
        return {
            category: categoryFix,
            showWords: showWords,
            answerWord: answerWord,
        };
    };

    //발언권 처음 랜덤 설정 / 45초 발언권 / 다음 발언권 상대 클릭
    // micToss = async (nickname) => {
    //     const micToss = await GameRepo.micToss(nickname);
    //
    //     let timer = setTimeout(() => {
    //         console.log(`발언 시간이 끝났습니다.`);
    //         // 질문하는 사람이 주어진 시간을 다 소비하고 질문할 상대를 지목하지 않은 상태
    //         // 질문하는 사람의 마이크를 랜덤으로 다른사람한테 토스
    //     }, 45000);
    //
    //     // 질문자가 주어진 시간 전에 질문할 사람을 지목했을 때.
    //     // 지목한 사람한테 마이크를 넘김.
    //     // 위에서 자동으로 실행되는 setTimeout을 정지.
    //     clearTimeout(timer);
    //
    //     let result = [];
    //     for (let i = 0; i < micToss.length; i++) {
    //         result.push(micToss[i]);
    //     }
    //
    //     shuffle(result);
    //     let randomStart = result.pop();
    //     console.log(`${nickname} 님 발언을 시작해주세요.`);
    //     return randomStart;
    // };
}

module.exports = new GameProvider();
