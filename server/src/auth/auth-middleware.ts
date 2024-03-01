import { NextFunction, Request, Response } from "express";
import AuthError from "./auth-errors";
import User from "../user/user-type";
import authService from "./auth-service";
import { AuthenticatedRequest } from "./auth-types";

export default async function authMiddleware (req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
            const {authorization} = req.headers;
            if (!authorization) {
                throw AuthError.Unauthorized();
            }
            const token = authorization.split(' ')[1];
            const user: User = await authService.verifyToken(token);
            if(!user) {
                throw AuthError.Unauthorized();
            }
            req.user = user;
            next();
        } catch (error) {
            if (error instanceof AuthError) res.status(error.status).json({
                message: error.message,
                status: "bad request"
            }) 
            else {
                res.status(error.status ?? 500).json({
                    status: "internal server error"
                })
                throw error;
            }
        }
}