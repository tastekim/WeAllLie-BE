const errorLogger = (error, req, res, next) => {
    console.error(error);
    next(error);
};

const errorHandler = (error, req, res) => {
    let statusCode;

    switch (error.name) {
        case 'UserError':
            statusCode = error.statusCode;
            res.status(statusCode).json({
                errorMessage: error.message,
            });
            break;

        case 'GameError':
            break;

        default:
            res.json({ errorMessage: error.message });
            break;
    }
};

module.exports = { errorLogger, errorHandler };
