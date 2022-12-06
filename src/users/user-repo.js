const User = require('../schemas/user');
require('dotenv').config();

class UserRefo {
    createUser = async (user) => {
        return await User.create(user);
    };

    findAllUser = async () => {
        return await User.find({});
    };

    findOneByEmail = async (email) => {
        return await User.findOne({ email });
    };

    findOneByNickname = async (nickname) => {
        return await User.findOne({ nickname });
    };

    findOneById = async (id) => {
        return await User.findById(id);
    };
}

module.exports = new UserRefo();
