const wrapAsync = (fn) => {
    return (req, res, next) => {
        // Controller 실행 후 Error 발생 시 next로 errorHandler로 보낸다.
        fn(req, res, next).catch(next);
    };
};

module.exports = wrapAsync;
