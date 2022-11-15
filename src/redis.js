require('dotenv').config();
const Redis = require('ioredis');

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
});

module.exports = redis;

// const redis = require('redis');
// require('dotenv').config();
//
// const redisClient = redis.createClient({
//     url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
//     legacyMode: true,
// });
// redisClient.on('connect', () => {
//     console.info('Redis connected!');
// });
// redisClient.on('error', (err) => {
//     console.error('Redis Client Error', err);
// });
// redisClient.connect().then();
// const redisCli = redisClient.v4;
//
// module.exports = redisCli;
