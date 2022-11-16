const {Schema, model, Types} = require('mongoose');


const RoomSchema = new Schema({
    _id: Number,


    roomTitle: {
        type    : String,
        required: true,
    },

    currentCount: {
        type   : Number,
        default: 1,
    },

    gameMode: {
        type    : Boolean,
        required: true,
        default : false,
    },

    roomStatus: {
        type   : Boolean,
        default: false,
    },

    private: {
        type    : Boolean,
        required: false,
        default : null,
    },

    roomPassword: {
        type    : Number,
        required: false,
        default : null,
    },

  roomMaker: {
    type : String,
    required: false,
    default : null,
  },

  spyUser: {
    type : String,
    required: false,
    default : null
  }

});

const Room = model('room', RoomSchema);

module.exports = Room;
