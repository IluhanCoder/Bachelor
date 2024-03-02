import { Request, Response } from "express";
import userService from "./user-service";
import { AuthenticatedRequest } from "../auth/auth-types";

export default new class UserController {
    async fetchUsers(req: AuthenticatedRequest, res: Response) {
        try {
            const currentUser = req.user;
            const result = await userService.fetchUsers(currentUser);
            res.status(200).json({
                status: "success",
                users: result
            })
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }   

    async getCurrentUser(req: AuthenticatedRequest, res: Response) {
        try {
            const user = req.user;
            res.status(200).json({
                status: "success",
                user
            })
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async getUserById(req: AuthenticatedRequest, res: Response) {
        try {
            const {userId} = req.params;
            const user = await userService.getUserById(userId);
            res.status(200).json({
                status: "success",
                user
            })
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }
}