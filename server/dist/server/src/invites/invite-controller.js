"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const invite_service_1 = __importDefault(require("./invite-service"));
exports.default = new class InviteController {
    async createInvite(req, res) {
        try {
            const currentUser = req.user;
            const { guest, projectId } = req.body;
            if (!currentUser)
                return res.status(401).json({ status: "fail", message: "unauthorized" });
            await invite_service_1.default.createInvite(currentUser._id.toString(), guest, projectId);
            res.status(200).json({
                status: "success"
            });
        }
        catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500);
            throw error;
        }
    }
    async getInvited(req, res) {
        try {
            const { projectId } = req.params;
            const invited = await invite_service_1.default.getInvited(projectId);
            res.status(200).json({
                status: "success",
                invited
            });
        }
        catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500);
            throw error;
        }
    }
    async getInvitesToUser(req, res) {
        try {
            const currentUser = req.user;
            if (!currentUser)
                return res.status(401).json({ status: "fail", message: "unauthorized" });
            const invites = await invite_service_1.default.getInvitesToUser(currentUser._id);
            res.status(200).json({
                status: "success",
                invites
            });
        }
        catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500);
            throw error;
        }
    }
    async seeInvite(req, res) {
        try {
            const { inviteId } = req.params;
            const { accept } = req.body;
            await invite_service_1.default.seeInvite(inviteId, accept);
            res.status(200).json({ status: "success" });
        }
        catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500);
            throw error;
        }
    }
    async cancelInvite(req, res) {
        try {
            const { guestId, projectId } = req.body;
            await invite_service_1.default.cancelInvite(guestId, projectId);
            res.status(200).json({ status: "success" });
        }
        catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500);
            throw error;
        }
    }
};
