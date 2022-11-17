const http = require('./src/app');
require('dotenv').config();
require('./src/socket');
require('./src/game/game-socket');
require('./src/rooms/room-socket');
const mongodb = require('./src/schemas');
const Room = require('./src/schemas/room');

if (Room) {
    Room.collection.drop();
}

mongodb();

http.listen(process.env.PORT, () => {
    console.log(`connect on http://127.0.0.1:${process.env.PORT}`);
});
