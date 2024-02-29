import { Request, Response } from "express";
import userService from "./user-service";

export default new class UserController {
    async fetchUsers(req: Request, res: Response) {
        try {
            const result = await userService.fetchUsers();
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
}