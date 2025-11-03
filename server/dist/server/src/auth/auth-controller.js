"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = __importDefault(require("./auth-service"));
const auth_errors_1 = __importDefault(require("./auth-errors"));
exports.default = new class AuthController {
    async registration(req, res) {
        try {
            const credentials = req.body;
            const user = await auth_service_1.default.registrate(credentials);
            return res.status(200).json({
                status: "success",
                user
            });
        }
        catch (error) {
            if (error instanceof auth_errors_1.default)
                res.status(error.status).json({
                    message: error.message,
                    status: "bad request"
                });
            else {
                res.status(error.status ?? 500).json({
                    status: "internal server error"
                });
                throw error;
            }
        }
    }
    async login(req, res) {
        try {
            const credentials = req.body;
            const token = await auth_service_1.default.login(credentials);
            return res.status(200).json({
                status: "success",
                token
            });
        }
        catch (error) {
            if (error instanceof auth_errors_1.default)
                res.status(error.status).json({
                    message: error.message,
                    status: "bad request"
                });
            else {
                res.status(error.status ?? 500).json({
                    status: "internal server error"
                });
                throw error;
            }
        }
    }
    async verifyToken(req, res) {
        try {
            const { token } = req.body;
            const user = await auth_service_1.default.verifyToken(token);
            return res.status(200).json({
                status: "success",
                user
            });
        }
        catch (error) {
            if (error instanceof auth_errors_1.default)
                res.status(error.status).json({
                    message: error.message,
                    status: "bad request"
                });
            else {
                res.status(error.status ?? 500).json({
                    status: "internal server error"
                });
                throw error;
            }
        }
    }
};
