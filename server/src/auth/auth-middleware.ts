import { NextFunction, Request, Response } from "express";
import AuthError from "./auth-errors";
import authService from "./auth-service";
import { AuthenticatedRequest } from "./auth-types";

export default async function authMiddleware (req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
            const {authorization} = req.headers;
            if (!authorization) {
                throw AuthError.Unauthorized();
            }
            const token = authorization.split(' ')[1];
            const user = await authService.verifyToken(token);
            if(!user) {
                throw AuthError.Unauthorized();
            }
            // Convert server-side user document to shared UserDto shape (strip sensitive fields)
            req.user = {
                _id: user._id.toString(),
                name: (user as any).name,
                surname: (user as any).surname,
                nickname: (user as any).nickname,
                email: (user as any).email,
                organisation: (user as any).organisation,
                avatar: (user as any).avatar
            } as any;
            next();
        } catch (error) {
            if (error instanceof AuthError) {
                res.status(error.status).json({
                    message: error.message,
                    status: "bad request"
                })
            } else {
                const status = (error as any)?.status ?? 500;
                res.status(status).json({
                    status: "internal server error"
                });
                throw error;
            }
        }
}