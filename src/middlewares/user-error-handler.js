// User 디렉토리에서 발생하는 에러 처리

const errorLogger = (error, req, res, next) => {
    console.error(error);
    next(error);
};

const errorHandler = (error, req, res, next) => {
    let statusCode;

    if (error.name === 'UserError') {
        statusCode = error.statusCode;
        res.status(statusCode).json({
            errorMessage: error.message,
        });
    } else {
        next(error);
    }
};

module.exports = { errorLogger, errorHandler };
