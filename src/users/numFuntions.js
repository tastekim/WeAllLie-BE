class numFunctions {
  autoIncrease = () => {
    let a = 1;
    const inner = function () {
      return a++;
    };
    return inner;
  };
}

module.exports = new numFunctions();
