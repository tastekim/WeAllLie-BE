const http = require('./app');
require('dotenv').config();
require('./socket');
require('./game/game-socket')
const mongodb = require('./schemas/index');

mongodb();

http.listen(process.env.PORT, () => {
  console.log(`connect on http://127.0.0.1:${process.env.PORT}`);
});
