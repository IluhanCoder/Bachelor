"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = __importDefault(require("./user-service"));
exports.default = new class UserController {
    async fetchUsers(req, res) {
        try {
            const currentUser = req.user;
            if (!currentUser)
                return res.status(401).json({ status: "fail", message: "unauthorized" });
            const result = await user_service_1.default.fetchUsers(currentUser);
            res.status(200).json({
                status: "success",
                users: result
            });
        }
        catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500);
            throw error;
        }
    }
    async getCurrentUser(req, res) {
        try {
            const user = req.user;
            res.status(200).json({
                status: "success",
                user
            });
        }
        catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500);
            throw error;
        }
    }
    async getUserById(req, res) {
        try {
            const { userId } = req.params;
            const user = await user_service_1.default.getUserById(userId);
            res.status(200).json({
                status: "success",
                user
            });
        }
        catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500);
            throw error;
        }
    }
    async updateUser(req, res) {
        try {
            const { userId } = req.params;
            const { newData } = req.body;
            await user_service_1.default.updateUser(userId, newData);
            res.status(200).json({
                status: "success"
            });
        }
        catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500);
            throw error;
        }
    }
    async setAvatar(req, res) {
        try {
            const { user, file } = req;
            if (!user)
                return res.status(401).json({ status: "fail", message: "unauthorized" });
            if (!file)
                return res.status(400).json({ status: "fail", message: "no file provided" });
            await user_service_1.default.setAvatar(user._id, file);
            return res.status(200).json({
                status: "success"
            });
        }
        catch (error) {
            console.log(error);
            return res.status(400).json({ status: "fail", message: "Set avatar error" });
        }
    }
};
