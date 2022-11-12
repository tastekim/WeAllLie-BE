const game = require('../socket');
const GameProvider = require('./game-provider');

game.on('connection', (socket) => {
    console.log('game-socket connected', socket.id)
    const gameProvider = new GameProvider();

    // 게임 플레이 종료 및 스파이 투표 시작.
    socket.on('', (msg) => {
        
    })

    // 게임 진행 중 스파이 투표 찬반 투표 실행.
    socket.on('nowVote', () => {

    })

    // 스파이 투표 찬반 집계.
    socket.on('nowVoteCount', () => {

    })

    // 스파이 투표 중 스파이 유저 선택 변경.
    socket.on('voteChange', () => {

    })

    // 유저 별 스파이 투표 받은 실시간 통계.
    socket.on('sendRealtimeVote', () => {

    })

    // 스파이 투표 종료.
    socket.on('endVote', () => {

    })
})