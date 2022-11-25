const socketIo = require('socket.io');
const { http, https } = require('./app');
const cors = require('cors');
require('dotenv').config();

const io = socketIo(https, cors({ origin: '*' }));

module.exports = io;
