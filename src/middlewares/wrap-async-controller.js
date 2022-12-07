const wrapAsyncController = (fn) => {
    return () => {
        // Controller 실행 후 Error 발생 시 next로 errorHandler로 보낸다.
        fn().catch((err) => console.log(err));
    };
};

module.exports = wrapAsyncController;
