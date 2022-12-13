const jwt = require('jsonwebtoken');
const jwtService = require('../../src/users/util/jwt');
const User = require('../../src/schemas/user');
require('dotenv').config();

describe('존재하는 함수 확인', () => {
    it('jwtService에 createAccessToken 함수가 존재한다.', () => {
        expect(typeof jwtService.createAccessToken).toBe('function');
    });

    it('jwtService에 createRefreshToken 함수가 존재한다.', () => {
        expect(typeof jwtService.createRefreshToken).toBe('function');
    });

    it('jwtService에 getAccessTokenPayload 함수가 존재한다.', () => {
        expect(typeof jwtService.getAccessTokenPayload).toBe('function');
    });

    it('jwtService에 validateAccessToken 함수가 존재한다.', () => {
        expect(typeof jwtService.validateAccessToken).toBe('function');
    });

    it('jwtService에 validateRefreshToken 함수가 존재한다.', () => {
        expect(typeof jwtService.validateRefreshToken).toBe('function');
    });

    it('jwtService에 validateSocketToken 함수가 존재한다.', () => {
        expect(typeof jwtService.validateSocketToken).toBe('function');
    });
});

describe('내부 동작 함수 실행 및 리턴값 확인', () => {
    let mockJwtSign, mockJwtVerify, mockFindById;
    beforeEach(() => {
        mockJwtSign = jest.fn();
        jwt.sign = mockJwtSign;
        mockJwtSign.mockReturnValue('토큰');
        mockJwtVerify = jest.fn();
        jwt.verify = mockJwtVerify;
        mockJwtVerify.mockReturnValue({ _id: '유저 아이디' });
        mockFindById = jest.fn();
        User.findById = mockFindById;
        mockFindById.mockReturnValue('유저 정보');
    });

    it('createAccessToken 함수가 실행되면 jwt.sign 함수가 1회 실행된다.', async () => {
        await jwtService.createAccessToken(1);
        expect(mockJwtSign).toBeCalledTimes(1);
    });

    it('createAccessToken 함수는 "토큰"을 생성해서 리턴한다.', async () => {
        expect(await jwtService.createAccessToken(1)).toBe('토큰');
    });

    it('validateAccessToken 함수가 실행되면 jwt.verify 함수가 1회 실행된다.', async () => {
        await jwtService.validateAccessToken('토큰');
        expect(mockJwtVerify).toBeCalledTimes(1);
    });

    it('validateAccessToken 함수는 토큰을 복호화하여 유저의 id 값을 리턴한다.', async () => {
        expect(await jwtService.validateAccessToken('토큰')).toBe('유저 아이디');
    });

    it('createRefreshToken 함수가 실행되면 jwt.sign 함수가 1회 실행된다.', async () => {
        await jwtService.createRefreshToken(1);
        expect(mockJwtSign).toBeCalledTimes(1);
    });

    it('createRefreshToken 함수는 "토큰"을 생성해서 리턴한다.', async () => {
        expect(await jwtService.createRefreshToken(1)).toBe('토큰');
    });

    it('validateRefreshToken 함수가 실행되면 jwt.verify 함수가 1회 실행된다.', async () => {
        await jwtService.validateRefreshToken('토큰');
        expect(mockJwtVerify).toBeCalledTimes(1);
    });

    it('validateSocketToken 함수가 실행되었을 때, 전달된 argument에 accessToken이 존재한다면 jwt.verify 함수가 1회 실행된다', async () => {
        await jwtService.validateSocketToken({ accessToken: '토큰있음' });
        expect(mockJwtVerify).toBeCalledTimes(1);
    });

    it('validateSocketToken 함수가 실행되었을 때, 전달된 argument에 accessToken이 존재한다면 User.findById 함수가 1회 실행된다', async () => {
        await jwtService.validateSocketToken({ accessToken: '토큰있음' });
        expect(mockFindById).toBeCalledTimes(1);
    });

    it('validateSocketToken 함수가 실행되었을 때, 전달된 argument에 accessToken이 존재한다면 "유저 정보"를 리턴한다.', async () => {
        const result = await jwtService.validateSocketToken({ accessToken: '토큰있음' });
        expect(result).toBe('유저 정보');
    });

    it('validateSocketToken 함수가 실행되었을 때, 전달된 argument에 accessToken이 존재하지 않는다면 undefined를 리턴한다.', async () => {
        const result = await jwtService.validateSocketToken({ notToken: '토큰없음' });
        expect(result).toBe(undefined);
    });
});
