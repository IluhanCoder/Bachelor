import { Request, Response } from "express";
import { AuthenticatedRequest } from "../auth/auth-types";
import inviteService from "./invite-service";

export default new class InviteController {
    async createInvite(req: AuthenticatedRequest, res: Response) {
        try {
            const currentUser = req.user;
            const {guest, projectId} = req.body;
            if(!currentUser) return res.status(401).json({status: "fail", message: "unauthorized"});
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

    async getInvitesToUser(req: AuthenticatedRequest, res: Response) {
        try {
            const currentUser = req.user;
            if(!currentUser) return res.status(401).json({status: "fail", message: "unauthorized"});
            const invites = await inviteService.getInvitesToUser(currentUser._id);
            res.status(200).json({
                status: "success",
                invites
            })
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async seeInvite(req: AuthenticatedRequest, res: Response) {
        try {
            const {inviteId} = req.params;
            const {accept} = req.body;
            await inviteService.seeInvite(inviteId, accept);
            res.status(200).json({status: "success"});
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async cancelInvite(req: AuthenticatedRequest, res: Response) {
        try {
            const { guestId, projectId } = req.body;
            await inviteService.cancelInvite(guestId, projectId);
            res.status(200).json({status: "success"});
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }
}