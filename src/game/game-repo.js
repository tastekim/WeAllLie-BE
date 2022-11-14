const {User, Game, Room} = require('../schemas');

class GameRepo {
    getSpy = async (roomNum) => {
        const roomData = await Room.findOne({_id: roomNum});
        return roomData.spyUser;
    };

    catchSpy = async (nickname) => {
        await Room.findOneAndUpdate({nickname}, {$inc: {voteCount: 1}});
        return 'Catch Spy!';
    };

    setPlayCount = async (nickname) => {
        await User.findOneAndUpdate({nickname}, {$inc: {totalPlayCount: 1}});
    };
}

module.exports = new GameRepo();