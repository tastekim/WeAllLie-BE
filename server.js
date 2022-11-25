const { http, https } = require('./src/app');
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
        https.listen(3000, () => {
            console.log('HTTPS 서버가 실행되었습니다. 포트 :: ' + process.env.PORT);
        });
    } catch (error) {
        console.log('HTTPS 서버가 실행되지 않습니다.');
        console.log(error);
        http.listen(process.env.PORT, () => {
            console.log('HTTP 서버가 실행되었습니다. 포트 :: ' + process.env.PORT);
        });
    }
} else {
    http.listen(process.env.PORT, () => {
        console.log('HTTP 서버가 실행되었습니다. 포트 :: ' + process.env.PORT);
    });
}
