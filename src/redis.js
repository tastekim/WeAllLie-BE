const redis = require('redis');
require('dotenv').config();

const redisClient = redis.createClient({
    url       : `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
    legacyMode: true
});
redisClient.on('connect', () => {
    console.info('Redis connected!');
});
redisClient.on('error', () => {
    console.error('Redis Client Error', err);
});
redisClient.connect().then();
const redisCli = redisClient.v4;

module.exports = redisCli;