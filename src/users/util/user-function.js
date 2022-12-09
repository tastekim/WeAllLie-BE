class UserFunction {
    // 유저 정보 가공 1 : 카카오에서 받아온 유저정보 => DB에 저장할 형태로 가공하기
    getNewUser = async (kakaoUserInfo, allUser) => {
        const allUserCount = allUser.length;
        let nickNum, nickname, _id;

        // 유저가 한 명도 없을 경우 초기값 세팅
        if (allUserCount === 0) {
            _id = 1;
            nickname = 'Agent_001';
        } else {
            // DB에 유저가 있을 경우
            const n = +allUser[allUserCount - 1]._id + 1;
            // n이 1000이상이면 Agent_ 뒤에 그대로 붙이고, 1000보다 작으면 001 의 형태로 붙이기
            if (n < 1000) {
                nickNum = (0.001 * n).toFixed(3).toString().slice(2);
                nickname = `Agent_${nickNum}`;
            } else {
                nickname = `Agent_${n}`;
            }
            _id = +nickNum;
        }

        // 위에서 만든 값으로 DB에 저장할 유저 정보 가공해서 리턴
        return {
            _id,
            nickname,
            email: kakaoUserInfo.kakao_account.email,
            profileImg: kakaoUserInfo.properties.thumbnail_image
                ? kakaoUserInfo.properties.thumbnail_image
                : 'default',
        };
    };

    // 유저 정보 가공 2 : 유저 정보 승률 계산 => 프론트로 전달할 형태로 가공하기
    // user: DB에서 가져온 유저 정보
    getPlayRecord = async (user) => {
        const defaultInfo = {
            userId: user._id,
            nickname: user.nickname,
            profileImg: user.profileImg,
            totayPlayCount: user.totalCount,
            spyPlayCount: user.spyPlayCount,
            ctzPlayCount: user.totalCount - user.spyPlayCount,
        };

        const spyWinRating = (user) => (user.spyWinCount / user.spyPlayCount).toFixed(2) * 100;
        const voteSpyRating = (user) =>
            (user.voteSpyCount / (user.totalCount - user.spyPlayCount)).toFixed(2) * 100;

        if (user.totalCount === 0) {
            defaultInfo.spyWinRating = 0;
            defaultInfo.voteSpyRating = 0;
            return defaultInfo;
        } else if (user.spyPlayCount === 0 && user.totalCount - user.spyPlayCount !== 0) {
            defaultInfo.spyWinRating = 0;
            defaultInfo.voteSpyRating = voteSpyRating(user);
            return defaultInfo;
        } else if (user.spyPlayCount !== 0 && user.totalCount - user.spyPlayCount === 0) {
            defaultInfo.spyWinRating = spyWinRating(user);
            defaultInfo.voteSpyRating = 0;
            return defaultInfo;
        } else {
            defaultInfo.spyWinRating = spyWinRating(user);
            defaultInfo.voteSpyRating = voteSpyRating(user);
            return defaultInfo;
        }
    };
}

module.exports = new UserFunction();
