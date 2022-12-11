const playRecord = {
    userId: 12,
    nickname: 'Agent_프리티강',
    profileImg:
        'http://k.kakaocdn.net/dn/bUFgwJ/btrLF3wdYE6/zsOaDBYLFfUjX9QhIkmZQ0/img_110x110.jpg',
    totalPlayCount: 0,
    spyPlayCount: 0,
    ctzPlayCount: 0,
    spyWinRating: 0,
    voteSpyRating: 0,
};

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

const toSaveInfo = [
    {
        _id: 1,
        nickname: 'Agent_001',
        email: 'test1@test.com',
        profileImg: 'http://1번유저프로필이미지',
    },
    {
        _id: 2,
        nickname: 'Agent_002',
        email: 'test2@test.com',
        profileImg: 'http://2번유저프로필이미지',
    },
    {
        _id: 3,
        nickname: 'Agent_003',
        email: 'test3@test.com',
        profileImg: 'http://3번유저프로필이미지',
    },
    {
        _id: 4,
        nickname: 'Agent_004',
        email: 'test4@test.com',
        profileImg: 'http://4번유저프로필이미지',
    },
    {
        _id: 5,
        nickname: 'Agent_005',
        email: 'test5@test.com',
        profileImg: 'http://5번유저프로필이미지',
    },
    {
        _id: 12,
        nickname: 'Agent_012',
        email: 'test12@test.com',
        profileImg: 'http://12번유저프로필이미지',
    },
];

const toSendInfo = {
    userId: 100,
    nickname: 'Agent_100',
    profileImg: 'default',
    totayPlayCount: 0,
    spyPlayCount: 0,
    ctzPlayCount: 0,
    spyWinRating: 0,
    voteSpyRating: 0,
    accessToken: '..-hsnQHlN7NzqE',
};

const queryData1 = { code: '이건인가코드' };

module.exports = {
    kakaoUserNotWithImg,
    kakaoUserWithImg,
    allUserLen0,
    allUserNotLen0,
    toSaveInfo,
    toSendInfo,
    playRecord,
    queryData1,
};
