"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: false,
        unique: false,
    },
    surname: {
        type: String,
        required: false,
        unique: false,
    },
    nickname: {
        type: String,
        required: true,
        unique: true,
    },
    organisation: {
        type: String,
        required: true,
        unique: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: false,
    },
    avatar: {
        type: {
            data: Buffer,
            contentType: String
        },
        required: false
    }
});
userSchema.methods.verifyPassword = async function (password) {
    const user = this;
    const isMatch = await bcrypt_1.default.compare(password, user.password);
    return isMatch;
};
const UserModel = mongoose_1.default.model('User', userSchema);
exports.default = UserModel;
