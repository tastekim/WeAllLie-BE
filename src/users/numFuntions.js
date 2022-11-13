const { User } = require('../schemas/user');

class numFunctions {
  lastNum = async () => {
    const allUser = await User.find();
    return allUser.slice(-1)[0]['_id'];
  };

  autoIncrease = () => {
    let a = this.lastNum();
    const inner = function () {
      return a++;
    };
    return inner;
  };
}

module.exports = new numFunctions();
