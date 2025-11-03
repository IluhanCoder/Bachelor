"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("./user-model"));
exports.default = new class UserService {
    async fetchUsers(currentUser) {
        const result = await user_model_1.default.find({ _id: { $ne: currentUser._id } });
        return result;
    }
    async getUserById(userId) {
        const result = await user_model_1.default.findById(userId);
        return result;
    }
    async updateUser(userId, newData) {
        await user_model_1.default.findByIdAndUpdate(userId, newData);
    }
    async setAvatar(userId, file) {
        const user = await user_model_1.default.findById(userId);
        if (user) {
            user.avatar = {
                data: file.buffer,
                contentType: file.mimetype
            };
            await user.save();
        }
    }
};
