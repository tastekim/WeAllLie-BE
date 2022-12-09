const kakaoUserNotWithImg = {
    kakao_account: {
        email: 'test1@test.com',
    },
    properties: {},
};

const kakaoUserWithImg = {
    kakao_account: {
        email: 'test2@test.com',
    },
    properties: {
        thumbnail_image: '이미지 경로',
    },
};

const allUserLen0 = [];
const allUserNotLen0 = [
    {
        _id: 2,
        email: 'user2@kakao.com',
        nickname: 'Agent_002',
        profileImg: '유저2_이미지경로2',
        spyPlayCount: 0,
        spyWinCount: 0,
        voteSpyCount: 0,
        totalCount: 0,
    },
    {
        _id: 6,
        email: 'user6@kakao.com',
        nickname: 'Agent_006',
        profileImg: '유저6_이미지경로6',
        spyPlayCount: 0,
        spyWinCount: 0,
        voteSpyCount: 3,
        totalCount: 5,
    },
    {
        _id: 7,
        email: 'user7@kakao.com',
        nickname: 'Agent_7번유저',
        profileImg: '유저7_이미지경로7',
        spyPlayCount: 5,
        spyWinCount: 2,
        voteSpyCount: 0,
        totalCount: 5,
    },
    {
        _id: 10,
        email: 'user10@kakao.com',
        nickname: 'Agent_유저유저',
        profileImg: '유저10_이미지경로10',
        spyPlayCount: 5,
        spyWinCount: 2,
        voteSpyCount: 3,
        totalCount: 10,
    },
    {
        _id: 11,
        email: 'user11@kakao.com',
        nickname: 'Agent_11번유저',
        profileImg: '유저11_이미지경로11',
        spyPlayCount: 5,
        spyWinCount: 2,
        voteSpyCount: 3,
        totalCount: 10,
    },
];

module.exports = { kakaoUserNotWithImg, kakaoUserWithImg, allUserLen0, allUserNotLen0 };
