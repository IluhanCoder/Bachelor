import { Request, Response } from "express";
import authService from "./auth-service";
import AuthError from "./auth-errors";

export default new class AuthController {
    async registration(req: Request, res: Response) {
        try {
            const credentials = req.body;
            const user = await authService.registrate(credentials);
            return res.status(200).json({
                status: "success",
                user
            });
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

    async login(req: Request, res: Response) {
        try {
            const credentials = req.body;
            const token = await authService.login(credentials);
            return res.status(200).json({
                status: "success",
                token
            });
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

    async verifyToken(req: Request, res: Response) {
        try {
            const { token } = req.body;
            const user = await authService.verifyToken(token);
            return res.status(200).json({
                status: "success",
                user
            });
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
}