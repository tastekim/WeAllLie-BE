const express = require('express');
const { Server } = require('http');
const session = require('express-session');
const passport = require('passport');
const logger = require('morgan');
const userRouter = require('./users/user-route');
const passportConfig = require('./middlewares/passport');
const router = require('./users/user-route');
const Room = require('./schemas/room')

require('dotenv').config();
const app = express();
const http = Server(app);

// middlewares
passportConfig();
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



module.exports = http;
