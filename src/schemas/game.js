const { Schema, model, Types } = require('mongoose');

const GameSchema = new Schema({
    category: {
        type: String,
        required: true,
    },

    word: {
        type: String,
        required: true,
    }
});

const User = model('game', UserSchema);

module.exports = User;
