const http = require('./src/app');
require('./src/socket');
require('./src/game/game-socket')
const connect = require('./src/schemas');
connect();

http.listen(3000, () => {
    console.log('connect on http://127.0.0.1');
});