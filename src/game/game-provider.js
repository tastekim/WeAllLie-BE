const GameRepo = require('./game-repo');
const Room = require('../schemas/room');
const redis = require('../redis');
const shuffle = require('shuffle-array');

class GameProvider {
    getSpy = async (roomNum) => {
        return await GameRepo.getSpy(roomNum);
    };

    catchSpy = async (nickname) => {
        return await GameRepo.catchSpy(nickname);
    };

    setPlayCount = async (nickname) => {
        await GameRepo.setPlayCount(nickname);
    };

    setVoteResult = async (roomNum, nickname) => {
        await redis.lpush(`gameRoom${roomNum}Result`, nickname);
        console.log('voteResult : ', await redis.lrange(`gameRoom${roomNum}Result`, 0, -1));
    };

    getResult = async (roomNum) => {
        // 투표 집계한 배열.
        const resultList = await redis.lrange(`gameRoom${roomNum}Result`, 0, -1);
        // 방에 참여 중인 유저 닉네임.
        const roomUsers = await redis.lrange(`gameRoom${roomNum}Users`, 0, -1);
        // spy 유저인 닉네임.
        const spyUser = await GameRepo.getSpy(roomNum);

        // 가장 표를 많이 받은 사람의 ['nickname', 투표받은 수]
        let maxVoteUser = ['', 0];

        for (let user of roomUsers) {
            let count = 0;
            resultList.forEach((vote) => {
                if (vote === user) count++;
            });
            if (count > maxVoteUser[1]) {
                maxVoteUser[0] = user;
                maxVoteUser[1] = count;
            }
        }
        // 게임이 끝난 후 redis 메모리 확보.
        await redis.del(`gameRoom${roomNum}Result`);
        await redis.del(`gameRoom${roomNum}Users`);

        // 가장 많이 표를 받은 사람이 spy 면 true, 아니면 false return.
        return {
            spyWin: maxVoteUser[0] === spyUser,
            maxVoteUser: maxVoteUser[0],
            maxVoteResult: maxVoteUser[1],
        };
    };

    // 각 방에 참여한 유저들의 닉네임 저장.
    setRoomUsers = async (roomNum, nickname) => {
        // roomUsers 가 존재하는 지 확인.
        const roomExist = await redis.exists(`gameRoom${roomNum}Users`);
        if (roomExist === 0) {
            // 없으면 생성 후 유저 닉네임 넣기.
            await redis.rpush(`gameRoom${roomNum}Users`, [nickname]);
        } else {
            // 있으면 그 key 에 닉네임 push.
            await redis.rpush(`gameRoom${roomNum}Users`, [nickname]);
        }
        console.log('roomUsers : ', await redis.lrange(`gameRoom${roomNum}Users`, 0, -1));
    };

    // nowVote 배열 생성.
    setNowVote = async (roomNum) => {
        await redis.set(`nowVote${roomNum}`, '0');
    };

    // nowVote 에 1++ / 1--
    nowVote = async (roomNum, voteStatus) => {
        if (voteStatus === true) {
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

        //mongoose에 있는 카테고리
        const showWords = await GameRepo.giveWord(categoryFix);
        const answerWord = shuffle(showWords).pop();
        await Room.findByIdAndUpdate({ _id: roomNum }, { $set: { gameWord: answerWord } });
        return {
            category: categoryFix,
            showWords: showWords,
            answerWord: answerWord,
        };
    };

    //발언권 처음 랜덤 설정 / 45초 발언권 / 다음 발언권 상대 클릭
    //시간안에 마이크를 넘길수 있고 넘어갈수있는데
    //셋타임아웃 안에 마이크를 넘길 수 있는 로직이 있을 거고, 45초 뒤에 랜덤으로 돌리는 로직
    //
    // micToss = async (nickname) => {
    //     const micToss = await GameRepo.micToss(nickname);

    //     let timer = setTimeout(() => {
    //         console.log(`발언 시간이 끝났습니다.`);
    //         //질문하는 사람이 주어진 시간을 다 소비하고, 질문할 상대를 지목하지 않은 상태
    //         //질문하는 사람의 마이크를 랜덤으로 다른사람한테 토스
    //     }, 45000);
    //     //질문자가 주어진 시간전에 질문할 사림을 지목했을 때.
    //     //지목한 사람한테 넘김
    //     //위에서 자동으로 실행되는 setTimeout을 정지
    //     //if문 으로
    //     clearTimeout(timer);

    //     let result = [];
    //     for (let i = 0; i < micToss.length; i++) {
    //         result.push(micToss[i]);
    //     }

    //     shuffle(result);
    //     let randomStart = result.pop();
    //     console.log(`${nickname} 님 발언을 시작해주세요.`);
    //     return randomStart;
    // };
}

module.exports = new GameProvider();
