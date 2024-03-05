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

    async updateUser (req: AuthenticatedRequest, res: Response) {
        try {
            const {userId} = req.params;
            const {newData} = req.body;
            await userService.updateUser(userId, newData);
            res.status(200).json({
                status: "success"
            })
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async setAvatar(req: AuthenticatedRequest, res: Response) {
        try {
          const {user, file} = req;
          if (req.file) await userService.setAvatar(file, user._id);
          return res.status(200).json({
            status: "success"
          });
        } catch (error) {
          console.log(error);
          return res.status(400).json({ message: "Set avatar error" });
        }
      }
}