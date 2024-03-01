import { Request, Response } from "express";
import { AuthenticatedRequest } from "../auth/auth-types";
import inviteService from "./invite-service";

export default new class InviteController {
    async createInvite(req: AuthenticatedRequest, res: Response) {
        try {
            const currentUser = req.user;
            const {guest, projectId} = req.body;
            await inviteService.createInvite(currentUser._id.toString(), guest, projectId);
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

    async getInvited(req: AuthenticatedRequest, res: Response) {
        try {
            const {projectId} = req.params;
            const invited = await inviteService.getInvited(projectId);
            res.status(200).json(
                {
                    status: "success",
                    invited
                }
            )
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }
}