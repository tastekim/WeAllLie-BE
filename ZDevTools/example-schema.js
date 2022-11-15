const { Schema, model, Types } = require('mongoose');
const { Post } = require('../schemas/post');
const { isValidObjectId } = require('mongoose');
const moment = require('moment');

const CommentSchema = new Schema({
  postId: {
    type: Types.ObjectId,
    required: true,
    // schemas/post.js 에서 collection을 생성할 때 선언했던 이름!! 대소문자 주의하기!
    // const Post = model("post", PostSchema); 에서 model의 첫 번째 파라미터 값!
    ref: 'post',
  },

  comment: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Comment = model('comment', CommentSchema);

module.exports = { Comment };
