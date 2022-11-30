const express = require('express');
const { Server } = require('http');
const HTTPS = require('https');
const fs = require('fs');
const session = require('express-session');
const passport = require('passport');
const logger = require('morgan');
const userRouter = require('./users/user-route');
<<<<<<< HEAD

=======
const { errorLogger, errorHandler } = require('../src/middlewares/error-handler');
//const passportConfig = require('./middlewares/passport');
>>>>>>> d9a4b3d (로그인 미들웨어 수정 및 적용, 에러 핸들러 추가)
const cors = require('cors');

require('dotenv').config();
const app = express();
const http = Server(app);

const option = {
    ca: fs.readFileSync(`/etc/letsencrypt/live/${process.env.DOMAIN}/fullchain.pem`),
    key: fs.readFileSync(`/etc/letsencrypt/live/${process.env.DOMAIN}/privkey.pem`),
    cert: fs.readFileSync(`/etc/letsencrypt/live/${process.env.DOMAIN}/cert.pem`),
};
const https = HTTPS.createServer(option, app);

// middlewares
app.use(function (req, res, next) {
    res.set({
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': req.headers.origin,
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers':
            'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, authorization, refreshToken, cache-control',
    });
    next();
});
app.use(
    cors({
        origin: '*',
    })
);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: process.env.SESSION_KEY,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);

app.use(passport.initialize());
app.use(passport.session());
app.use('/', userRouter);
app.use(errorLogger, errorHandler);

module.exports = { http, https };
