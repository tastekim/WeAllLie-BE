const { Schema, model, Types } = require('mongoose');

const GameSchema = new Schema({
    _id: Number,
    // const userIndex = new Date().getTime().toString(36); 로 생성
    // 혹시라도 중복일 경우 대비하여 에러 핸들 추가
    // ObjectID 에 대한 validation 을 사용할 수 있다면 사실 필요없지 않을까 싶다. 찾아봐야겠다 -_-

    category: {
        type: String,
        required: true,
    },

    word: {
        // 유저가 입력하는 값... 이거 받아와야 하는데 ㅠㅠ
        type: String,
        required: true,
    }
});

const User = model('game', UserSchema);

module.exports = User;
