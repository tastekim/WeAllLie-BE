// 좀 더 에러를 세분화 하려면 에러 클래스 생성해서 추가

class CustomError extends Error {
    constructor(message, statusCode = 500) {
        super(message);

        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = CustomError;
