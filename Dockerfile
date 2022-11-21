FROM node:17-alpine

ENV MONGO_URI=mongodb+srv://admin:owMAXPM3YkYgnj6z@cluster0.fopdzyo.mongodb.net/WeAllLie\
    PORT=3000\
    CLIENT_ID=d37e4af6063817a749509bac0537a1a9\
    CALLBACK_URL=http://127.0.0.1:3000/api/auth/kakao/callback\
    SESSION_KEY=WeAllLie\
    SECRET_KEY=WeAllLie\
    REDIS_HOST=redis-19934.c239.us-east-1-2.ec2.cloud.redislabs.com\
    REDIS_PORT=19934\
    REDIS_USERNAME=default\
    REDIS_PASSWORD=lC0Qw25U5gBCKnCJeVCl5wMT7GSVskGx\
    CLIENT_ID_FRONT=0da4660f22013059ba89802857a441b2\
    CLIENT_SECRET=9Z64aHdRqrwb0hQbwreyqSPoTyh1SUAv\
    CALLBACK_URL_LOCAL=http://localhost:3000/api/auth/kakao\/callback

ADD package*.json .

RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "start"]