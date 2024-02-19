"use strict";
// auth.service.spec.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_entity_1 = require("src/typeorm/entities/user.entity");
const bcrypt_1 = require("src/libs/bcrypt");
const context_session_1 = require("src/libs/context-session");
const error_1 = require("src/libs/error");
const auth_service_1 = require("src/services/auth.service");
jest.mock('src/libs/bcrypt');
jest.mock('src/libs/context-session');
describe('AuthService', () => {
    let authService;
    let mockUserRepository;
    beforeEach(() => {
        authService = new auth_service_1.AuthService();
        mockUserRepository = {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
        };
        authService['userRepository'] = mockUserRepository;
    });
    describe('getUser', () => {
        it('should return user if session exists', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = new user_entity_1.User();
            context_session_1.getUserSession.mockResolvedValueOnce({
                user_id: '123',
            });
            mockUserRepository.findOne.mockResolvedValueOnce(mockUser);
            const [user, error] = yield authService.getUser();
            expect(user).toEqual(mockUser);
            expect(error).toBeNull();
        }));
    });
    describe('login', () => {
        it('should return user on successful login', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = new user_entity_1.User();
            mockUser.userPassword = 'encodedPassword';
            bcrypt_1.comparePassword.mockResolvedValueOnce(true);
            mockUserRepository.findOne.mockResolvedValueOnce(mockUser);
            const [user, error] = yield authService.login('test@example.com', 'password');
            expect(user).toEqual(mockUser);
            expect(error).toBeNull();
        }));
        it('should return error on wrong password', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = new user_entity_1.User();
            mockUser.userPassword = 'encodedPassword';
            bcrypt_1.comparePassword.mockResolvedValueOnce(false);
            mockUserRepository.findOne.mockResolvedValueOnce(mockUser);
            const [user, error] = yield authService.login('test@example.com', 'wrongPassword');
            expect(user).toBeNull();
            expect(error).toBeInstanceOf(error_1.StandardError);
        }));
    });
    describe('register', () => {
        it('should successfully register user', () => __awaiter(void 0, void 0, void 0, function* () {
            const hashedPassword = 'encodedPassword';
            bcrypt_1.hashPassword.mockResolvedValueOnce(hashedPassword);
            const mockUser = new user_entity_1.User();
            mockUserRepository.create.mockReturnValueOnce(mockUser);
            mockUserRepository.save.mockResolvedValueOnce(mockUser);
            const user = yield authService.register('test@example.com', 'password');
            expect(user).toEqual(mockUser);
        }));
    });
});
//# sourceMappingURL=auth.service.test.js.map