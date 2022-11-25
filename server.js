const { http, app } = require('./src/app');
const HTTPS = require('https');
const fs = require('fs');
require('dotenv').config();
require('./src/socket');
require('./src/game/game-socket');
require('./src/rooms/room-socket');
require('./src/chat/chat-socket');
const mongodb = require('./src/schemas');
const Room = require('./src/schemas/room');

try {
    Room.collection.drop();
} catch (e) {
    console.log(e.message);
}

mongodb();

// 운영 환경일때만 적용
if (process.env.NODE_ENV == 'production') {
    try {
        const option = {
            ca: fs.readFileSync(`/etc/letsencrypt/live/${process.env.DOMAIN}/fullchain.pem`),
            key: fs.readFileSync(`/etc/letsencrypt/live/${process.env.DOMAIN}/privkey.pem`),
            cert: fs.readFileSync(`/etc/letsencrypt/live/${process.env.DOMAIN}/cert.pem`),
        };

        HTTPS.createServer(option, app).listen(3000, () => {
            console.log('HTTPS 서버가 실행되었습니다. 포트 :: ' + process.env.PORT);
        });
    } catch (error) {
        console.log('HTTPS 서버가 실행되지 않습니다.');
        http.listen(process.env.PORT, () => {
            console.log('HTTP 서버가 실행되었습니다. 포트 :: ' + process.env.PORT);
        });
    }
} else {
    http.listen(process.env.PORT, () => {
        console.log('HTTP 서버가 실행되었습니다. 포트 :: ' + process.env.PORT);
    });
}
