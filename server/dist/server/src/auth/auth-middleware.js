"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_errors_1 = __importDefault(require("./auth-errors"));
const auth_service_1 = __importDefault(require("./auth-service"));
async function authMiddleware(req, res, next) {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            throw auth_errors_1.default.Unauthorized();
        }
        const token = authorization.split(' ')[1];
        const user = await auth_service_1.default.verifyToken(token);
        if (!user) {
            throw auth_errors_1.default.Unauthorized();
        }
        // Convert server-side user document to shared UserDto shape (strip sensitive fields)
        req.user = {
            _id: user._id.toString(),
            name: user.name,
            surname: user.surname,
            nickname: user.nickname,
            email: user.email,
            organisation: user.organisation,
            avatar: user.avatar
        };
        next();
    }
    catch (error) {
        if (error instanceof auth_errors_1.default) {
            res.status(error.status).json({
                message: error.message,
                status: "bad request"
            });
        }
        else {
            const status = error?.status ?? 500;
            res.status(status).json({
                status: "internal server error"
            });
            throw error;
        }
    }
}
exports.default = authMiddleware;
