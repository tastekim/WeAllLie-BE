const game = require('../socket');
const GameProvider = require('./game-provider');

game.on('connection', (socket) => {
    console.log('game-socket connected', socket.id);
    const gameProvider = new GameProvider();

    // 스파이 투표 중 스파이 유저 선택.
    socket.on('voteSpy', (nickname, fn) => {
        // fn -> [FE]지목당한 nickname의 숫자를 1 증감 시켜주는 액션.
        // 유저 별로 실시간 자기가 지목당한 카운트를 표시한다.
        fn(nickname);

        // 지목한 사람(socket)한테 지목당한 사람(nickname)의 정보를 담는다.
        // 투표가 끝나고 나서 socket.voteSpy안에 스파이의 nickname을 갖고있는 사람은 스파이를 찾는데 성공.
        socket.voteSpy = nickname;
    });

    // 스파이 투표 종료.
    socket.on('endVote', () => {

    });

    // 게임 진행 중 스파이 투표 찬반 투표 실행.
    socket.on('', () => {

    });

    // 스파이 투표 찬반 집계.
    socket.on('nowVoteCount', () => {

    });


});