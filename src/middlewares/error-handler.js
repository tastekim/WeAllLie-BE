const errorLogger = (error, req, res, next) => {
    console.error(error);
    next(error);
};

const errorHandler = (error, req, res) => {
    const statusCode = error.statusCode || 400;

    res.status(statusCode).json({
        errorMessage: error.message,
    });
};

module.exports = { errorLogger, errorHandler };
