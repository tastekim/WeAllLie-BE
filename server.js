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

try {
    if (process.env.NODE_ENV === 'production') {
        https.listen(process.env.PORT, () => {
            console.log(`HTTPS SERVER CONNECTED, PORT :: ${process.env.PORT}}`);
        });
    } else {
        http.listen(process.env.PORT, () => {
            console.log(`HTTP SERVER CONNECTED, PORT :: ${process.env.PORT}}`);
        });
    }
} catch (e) {
    console.log(e.message);
    http.listen(process.env.PORT, () => {
        console.log(`connected on HTTP, PORT :: ${process.env.PORT}}`);
    });
}
