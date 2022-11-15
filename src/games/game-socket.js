const socketIo = require('socket.io')
const http = require('./app')
const game = require('../socket');
const GameProvider = require('./game-provider')
const io = socketIo(http)

game.on('connection', (socket) => {
    const gameProvider = new GameProvider()
    console.log('socket server conneted!')

    //스파이 선택
    socket.on('selectSpy', (nickname) => {
        socket.emit('selectSpy', gameProvider.selectSpy(nickname)) 
    })
    
    //정답 단어 보여주기
    socket.on('giveWord', (word) => {
        socket.emit('giveWord', gameProvider.giveWord(word)) 
    })

    //카테고리 & 단어 막무가내로 보여주기
    socket.on('giveExample', (category, word) => {
        socket.emit('giveExample', gameProvider.giveExample(category, word)) 
    })

    //발언권 지목
    socket.on('micToss', (nickname) => {
        socket.emit('micToss', gameProvider.micToss(nickname))
    })

 })

module.exports = io

