const GameRepo = require('./game-repo');
const redisCli = require('../redis');
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
        await redisCli.set(`gameRoom${roomNum}Result`, []);
        await redisCli.rpush(`gameRoom${roomNum}Result`, nickname);
    };

    getResult = async (roomNum) => {
        const resultList = await redisCli.get(`gameRoom${roomNum}Result`);
        for (let item of resultList) {

        }
    };

    selectSpy = async (nickname) => {
        const spyUser = await GameRepo.selectSpy(nickname);

        let result = [];
        for (let i = 0; i < spyUser.length; i++) {
            result.push(spyUser[i]);
        }

        shuffle(result);
        let spy = result.slice(-1);
        return spy;
    };

    //정답 단어 보여주기 //if스파이면 단어랑 카테고리 안보여주기
    giveWord = async (word) => {
        const giveWord = await GameRepo.giveWord(word);
        if (isSpy) {
            return {'message': '시민들이 정답 단어 확인 중 입니다.'};
        }

        let result = []
        for (let i = 0; i < giveWord.length; i++) {
            result.push(giveWord[i]);
        }

        shuffle(result);
        let answerWord = result.slice(-1);
        return answerWord;
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
        const gameWord = shuffle(categoryFix);
        return categoryFix;
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
        let randomStart = result.slice(-1);
        return randomStart;
    };
}

module.exports = new GameProvider();
