const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
require('dotenv').config();
//assert는 Node.js 내부에서 테스트를 해보기 위한 모듈이다.

// 연결할 url
const url = process.env.MONGO_URI;
// DB 이름
const dbName = 'WeAllLie';

// MongoClient를 생성
const client = new MongoClient(url);

// 서버에 연결하기 위한 connect 메소드
client.connect(function (err) {
    assert.equal(null, err); //equal은 err가 null일 때 넘겨준다
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    client.close();
});
