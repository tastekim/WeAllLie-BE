const express = require('express');
const { Server } = require('http');
const session = require('express-session');
const passport = require('passport');
const logger = require('morgan');
const userRouter = require('./users/user-route');
const passportConfig = require('./middlewares/passport');
const cors = require('cors');
const path = require('path');
const { ApplicationCostProfiler } = require('aws-sdk');

require('dotenv').config({ path: path.join(__dirname, '/.env') });
const app = express();
const http = Server(app);

// middlewares
passportConfig();
app.use(cors({ origin: true }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
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
