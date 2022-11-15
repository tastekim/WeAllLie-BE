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

const Game = model('game', GameSchema);

module.exports = Game;
