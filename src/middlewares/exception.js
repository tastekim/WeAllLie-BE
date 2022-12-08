// 좀 더 에러를 세분화 하려면 에러 클래스 생성해서 추가

class CustomError extends Error {
    constructor(message, statusCode = 500) {
        super(message);

        this.message = message;
        this.statusCode = statusCode;
    }
}

class SetError extends Error {
    constructor(message, statusCode) {
        super(message);

        this.message = message;
        this.statusCode = statusCode;
    }
}

// User 디렉토리에서 사용하는 에러
class UserError extends Error {
    constructor(message, statusCode = 500) {
        super(message);

        this.name = 'UserError';
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = {
    CustomError,
    UserError,
    SetError,
};
