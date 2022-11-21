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
        await redis.lpush(`gameRoom${roomNum}Result`, [nickname]);
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

    //방안에 있는 사람을 모아야 하는 로직을 만들어야함
    //랜덤으로 스파이 유저를 뽑고, 그 방에 스파이 정보를 에밋을 받고
    //스파이인유저랑 시민유저들 저장후 셔플

    collectUserNickname = async (roomNum) => {
        // 방에 참여 중인 유저 닉네임.
        await redis.set(`gameRoom${roomNum}Users`, 0, -1);
    };

    // 스파이 랜덤 설정
    selectSpy = async (roomNum, spyUser) => {
        const getAllNickname = await redis.get(`gameRoom${roomNum}Users`, 0, -1);

        let result = [];
        for (let i = 0; i < getAllNickname.length; i++) {
            result.push(getAllNickname[i]);
        }
        shuffle(result);
        let spy = result.slice(-1);

        //스파이 저장
        const saveSpy = await redis.set(`roomSpy${roomNum}`, spyUser, spy);
        return saveSpy;
    };

    giveWord = async (spyUser, category) => {
        //정답 단어 보여주기 //if스파이면 단어랑 카테고리 안보여주기
        const isSpy = await redis.get(`room${spyUser}`);

        if (isSpy) {
            return { message: '시민들이 제시어를 확인 중 입니다.' };
        }
        //category 랜덤으로 출력
        const givecategory = await GameRepo.giveCategory(category);

        let answer = [];

        for (let i = 0; i < givecategory.length; i++) {
            answer.push(givecategory[i]);
        }

        shuffle(answer);
        let categoryFix = answer.slice(-1);

        //shuffle로 추출된 카테고리를 redis에 저장함
        const selectCategory = await redis.set(`game${selectCategory}`, categoryFix);
        //mongoose에 있는 카테고리
        const showCategory = await GameRepo.giveWord(categoryFix);

        //단어 랜덤으로 1개 지정 (제시어)
        if (selectCategory === showCategory.category) {
            await redis.get(`game${selectCategory}`);
            const realAnswer = await GameRepo.giveWord(categoryFix);

            let result = [];

            for (let i in realAnswer) {
                result.push(realAnswer[i]);
            }

            shuffle(result);
            let answerWord = result.slice(-1);
            return answerWord;
        }
    };

    //카테고리 픽스안의 단어 보여주기 (카테고리에 있는 key값과 카테고리픽스의 key값이 같은 value값을 보여주기)
    //레디스에서 값으 불러와서 그걸 쿼리로 보내
    giveExample = async (category, selectCategory) => {
        const categoryFix = await redis.get(`game${selectCategory}`, 0);
        const giveExample = await GameRepo.giveExample(category);

        if (categoryFix === giveExample) {
            await redis.get(`game${selectCategory}`);
            await GameRepo.giveExample(category);
            let showWord = [];
            Object.values(category);
            console.log(showWord);
        }
    };

    //발언권 처음 랜덤 설정 / 45초 발언권 / 다음 발언권 상대 클릭
    micToss = async (nickname) => {
        const micToss = await GameRepo.micToss(nickname);

        let timer;
        setTimeout(() => {
            console.log(`발언 시간이 끝났습니다.`);
            clearInterval(timer);
        }, 45000);

        let result = [];
        for (let i = 0; i < micToss.length; i++) {
            result.push(micToss[i]);
        }

        shuffle(result);
        let randomStart = result.slice(-1);
        console.log(`${nickname} 님 발언을 시작해주세요.`);
        return randomStart;
    };
}

module.exports = new GameProvider();
