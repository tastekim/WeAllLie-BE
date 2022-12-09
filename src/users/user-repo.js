const User = require('../schemas/user');

class UserRefo {
    createUser = async (user) => {
        const newUser = await User.create(user);
        return newUser;
    };

    findAllUser = async () => {
        const allUser = await User.find({});
        return allUser;
    };

    findOneByEmail = async (email) => {
        const exUser = await User.findOne({ email });
        return exUser;
    };

    findOneByNickname = async (nickname) => {
        const exUser = await User.findOne({ nickname });
        return exUser;
    };

    findOneById = async (id) => {
        const exUser = await User.findById(id);
        return exUser;
    };

    updateNick = async (_id, nickname) => {
        await User.updateOne({ _id }, { nickname });
    };
}

module.exports = new UserRefo();
