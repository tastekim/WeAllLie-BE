const http = require('./src/app');
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

http.listen(process.env.PORT, () => {
    console.log(`connect on http://127.0.0.1:${process.env.PORT}`);
});
