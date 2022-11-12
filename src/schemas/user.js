const { Schema, model, Types } = require('mongoose');

const UserSchema = new Schema({
  userIndex: {
    type: String,
    required: true,
    unique: true,
  },
  // const userIndex = new Date().getTime().toString(36); 로 생성
  // 혹시라도 중복일 경우 대비하여 에러 핸들 추가
  // ObjectID 에 대한 validation 을 사용할 수 있다면 사실 필요없지 않을까 싶다. 찾아봐야겠다 -_-

  email: {
    type: String,
    required: true,
  },

  nickname: {
    // 유저가 입력하는 값... 이거 받아와야 하는데 ㅠㅠ
    type: String,
    required: true,
  },

  profileImg: {
    type: String,
  },

  spyPlayCount: {
    type: Number,
    required: true,
    default: 0,
  },

  spyWinCount: {
    type: Number,
    required: true,
    default: 0,
  },

  voteSpyCount: {
    type: Number,
    required: true,
    default: 0,
  },

  totalCount: {
    type: Number,
    required: true,
    default: 0,
  },
});

const User = model('user', UserSchema);

module.exports = User;
