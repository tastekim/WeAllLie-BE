const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  _id: {
    type: Number,
    required: true,
    unique: true,
  },

  // const userIndex = new Date().getTime().toString(36); 로 생성
  // 혹시라도 중복일 경우 대비하여 에러 핸들 추가
  email: {
    type: String,
    required: true,
    unique: true,
  },

  nickname: {
    // 초기값은 랜덤값 부여하기로 함 => 일단 userIndex와 동일 => 추후 유저가 변경 가능(중복불가)
    type: String,
    required: true,
    unique: true,
  },

  profileImg: {
    type: String,
    required: true,
    default: 'default',
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

  ready: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const User = model('user', UserSchema);
module.exports = { User };
