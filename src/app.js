const express = require('express');
const app = express();
const {Server} = require('http');
const http = Server(app);

module.exports = http;