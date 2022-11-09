const http = require('./src/app');
require('./src/socket');

http.listen(3000, () => {
    console.log('connect on http://127.0.0.1');
});