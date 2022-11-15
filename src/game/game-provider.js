const GameRepo = require('./game-repo');
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
        // roomResult 가 존재하는 지 확인.
        const roomExist = await redis.exists(`gameRoom${roomNum}Result`);
        if (roomExist === 0) {
            // 없으면 생성 후 유저 닉네임 넣기.
            // await redisCli.set(`gameRoom${roomNum}Result`, nickname);
            await redis.rpush(`gameRoom${roomNum}Result`, nickname);
        } else {
            // 있으면 그 key 에 닉네임 push.
            await redis.rpush(`gameRoom${roomNum}Result`, nickname);
            console.log('voteResult : ', await redis.get(`gameRoom${roomNum}Result`));
        }
    };

    getResult = async (roomNum) => {
        // 투표 집계한 배열.
        const resultList = await redis.get(`gameRoom${roomNum}Result`);
        // 방에 참여 중인 유저 닉네임.
        const roomUsers = await redis.get(`gameRoom${roomNum}Users`);
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
            await redis.set(`gameRoom${roomNum}Users`, [nickname]);
            await redis.rpush(`gameRoom${roomNum}Users`, nickname);
        } else {
            // 있으면 그 key 에 닉네임 push.
            await redis.rpush(`gameRoom${roomNum}Users`, nickname);
        }
        console.log('roomUsers : ', await redis.get(`gameRoom${roomNum}Users`));
    };

    selectSpy = async (nickname) => {
        const spyUser = await GameRepo.selectSpy(nickname);

        let result = [];
        for (let i = 0; i < spyUser.length; i++) {
            result.push(spyUser[i]);
        }

        shuffle(result);
        return result.slice(-1);
    };

    //정답 단어 보여주기 //if스파이면 단어랑 카테고리 안보여주기
    giveWord = async (word) => {
        const giveWord = await GameRepo.giveWord(word);
        if (isSpy) {
            return { message: '시민들이 정답 단어 확인 중 입니다.' };
        }

        let result = [];
        for (let i = 0; i < giveWord.length; i++) {
            result.push(giveWord[i]);
        }

        shuffle(result);
        return result.slice(-1);
    };

    //카테고리 & 단어 막무가내로 보여주기
    giveExample = async (category, word) => {
        const gameCategory = await GameRepo.giveExample(category);
        let result = [];

        for (let i = 0; i < gameCategory.length; i++) {
            result.push(gameCategory[i]);
        }

        shuffle(result);
        let categoryFix = result.slice(0, 20);
        return shuffle(categoryFix);
    };

    //발언권 랜덤 설정
    //발언권 처음 랜덤 설정 / 지목당한 사람이 발언 후 발언권 넘길 다음 상대방 클릭 / 발언권 시간 최대 45초 (넘 긴것같은데..) /
    //넘길 사람 선택 안할 시 랜덤으로 발언권 부여 / 연속해서 같은 사람을 지목하는 건 안됨 /나한테 발언권 준 사람은 못 찍음
    micToss = async (nickname) => {
        const micToss = await GameRepo.micToss(nickname);

        let timer;
        setTimeout(() => {
            console.log(`발언시간이 끝났습니다.`);
            clearInterval(timer);
        }, 45000);

        let result = [];
        for (let i = 0; i < micToss.length; i++) {
            result.push(micToss[i]);
        }

        shuffle(result);
        return result.slice(-1);
    };
}

module.exports = new GameProvider();
