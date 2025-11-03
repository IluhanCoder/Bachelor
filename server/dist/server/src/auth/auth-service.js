"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../user/user-model"));
const auth_errors_1 = __importDefault(require("./auth-errors"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.default = new class AuthService {
    async registrate(credentials) {
        try {
            const existingUser = await user_model_1.default.findOne({ $or: [{ nickname: credentials.nickname }, { email: credentials.email }] });
            if (existingUser)
                throw auth_errors_1.default.UserExists();
            const salt = await bcrypt_1.default.genSalt(10);
            const hashedPassword = await bcrypt_1.default.hash(credentials.password, salt);
            const user = await user_model_1.default.create({ ...credentials, password: hashedPassword });
            return user;
        }
        catch (error) {
            throw error;
        }
    }
    async login(credentials) {
        try {
            const user = await user_model_1.default.findOne({ $or: [{ nickname: credentials.nickname }, { email: credentials.email }] });
            if (!user)
                throw auth_errors_1.default.UserNotFound();
            const validPassword = await bcrypt_1.default.compare(credentials.password, user.password);
            if (!validPassword)
                throw auth_errors_1.default.WrongPassword();
            const secret = process.env.JWT_SECRET;
            if (!secret)
                throw auth_errors_1.default.VerificationFailed();
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, secret);
            return token;
        }
        catch (error) {
            throw error;
        }
    }
    async verifyToken(token) {
        try {
            const secret = process.env.JWT_SECRET;
            if (!secret)
                throw auth_errors_1.default.VerificationFailed();
            const { userId } = jsonwebtoken_1.default.verify(token, secret);
            if (!userId)
                throw auth_errors_1.default.VerificationFailed();
            const user = await user_model_1.default.findById(userId);
            if (!user)
                throw auth_errors_1.default.UserNotFound();
            return user;
        }
        catch (error) {
            throw error;
        }
    }
};
