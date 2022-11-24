const socketIo = require('socket.io');
const { http, app } = require('./app');
const HTTPS = require('https');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();

let io;
if (process.env.NODE_ENV === 'production') {
    try {
        const option = {
            ca: fs.readFileSync(`/etc/letsencrypt/live/${process.env.DOMAIN}/fullchain.pem`),
            key: fs.readFileSync(`/etc/letsencrypt/live/${process.env.DOMAIN}/privkey.pem`),
            cert: fs.readFileSync(`/etc/letsencrypt/live/${process.env.DOMAIN}/cert.pem`),
        };
        const https = HTTPS.createServer(option, app);
        io = socketIo(https, cors({ origin: '*' }));
    } catch (e) {
        console.log('io가 HTTPS 에서 실행되지 않습니다.');
    }
}
io = socketIo(http);

module.exports = io;
