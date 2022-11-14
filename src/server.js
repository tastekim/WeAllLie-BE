const http = require('./app');
require('dotenv').config();
require('./socket');
require('./game/game-socket')
const mongodb = require('./schemas/index');
require('./rooms/room-socket')
const Room = require('./schemas/room')

Room.collection.drop()

mongodb();

http.listen(process.env.PORT, () => {
  console.log(`connect on http://127.0.0.1:${process.env.PORT}`);
});
