const socketIo = require('socket.io');
const { http, https } = require('./app');
const cors = require('cors');
require('dotenv').config();

let io;

if (process.env.NODE_ENV == 'production') {
    try {
        io = socketIo(https, cors({ origin: '*' }));
        console.log('io : HTTPS 로 서버가 실행되었습니다. 포트 :: ' + process.env.PORT);
    } catch (e) {
        console.log('io : HTTPS로 서버가 실행되지 않습니다.');
        console.log(e);
        io = socketIo(http);
        console.log('io : HTTP 로 서버가 실행되었습니다. 포트 :: ' + process.env.PORT);
    }
} else {
    io = socketIo(http);
    console.log('io : HTTP 로 서버가 실행되었습니다. 포트 :: ' + process.env.PORT);
}

module.exports = io;
