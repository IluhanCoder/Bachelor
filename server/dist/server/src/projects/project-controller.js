"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const project_service_1 = __importDefault(require("./project-service"));
exports.default = new class ProjectController {
    async newProject(req, res) {
        try {
            const { name } = req.body;
            const owner = req.user;
            if (!owner)
                return res.status(401).json({ status: "fail", message: "unauthorized" });
            const result = await project_service_1.default.createProject({ name, owner: owner._id });
            return res.json({
                status: "success",
                projectId: result._id
            }).status(200);
        }
        catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500);
            throw error;
        }
    }
    async getProjectById(req, res) {
        try {
            const { id } = req.params;
            const project = await project_service_1.default.getProjectById(id);
            return res.json({
                status: "success",
                project
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
    async getUserProjects(req, res) {
        try {
            const { user } = req;
            if (!user)
                return res.status(401).json({ status: "fail", message: "unauthorized" });
            const projects = await project_service_1.default.getUserProjects(user._id.toString());
            res.json({
                status: "success",
                projects
            }).status(500);
        }
        catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500);
            throw error;
        }
    }
    async leaveProject(req, res) {
        try {
            const { projectId } = req.params;
            const { user } = req;
            if (!user)
                return res.status(401).json({ status: "fail", message: "unauthorized" });
            await project_service_1.default.deleteParitcipant(projectId, user._id);
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
    async deleteParticipant(req, res) {
        try {
            const { projectId } = req.params;
            const { userId } = req.body;
            if (!req.user)
                return res.status(401).json({ status: "fail", message: "unauthorized" });
            await project_service_1.default.deleteParitcipant(projectId, userId);
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
    async getParticipants(req, res) {
        try {
            const { projectId } = req.params;
            if (!req.user)
                return res.status(401).json({ status: "fail", message: "unauthorized" });
            const participants = await project_service_1.default.getParicipants(projectId);
            res.status(200).json({
                status: "success",
                participants
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
    async getUserRights(req, res) {
        try {
            const { projectId } = req.params;
            const currentUser = req.user;
            if (!currentUser)
                return res.status(401).json({ status: "fail", message: "unauthorized" });
            const rights = await project_service_1.default.getUserRights(currentUser._id, projectId);
            res.status(200).json({
                status: "success",
                rights
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
    async getRights(req, res) {
        try {
            const { projectId } = req.params;
            const rights = await project_service_1.default.getRights(projectId);
            res.status(200).json({
                status: "success",
                rights
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
    async setRights(req, res) {
        try {
            const { projectId } = req.params;
            const { rights } = req.body;
            await project_service_1.default.setRights(projectId, rights);
            res.status(200).json({
                status: "success",
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
    async changeOwner(req, res) {
        try {
            const { projectId } = req.params;
            const { oldOwnerId, newOwnerId } = req.body;
            if (!req.user)
                return res.status(401).json({ status: "fail", message: "unauthorized" });
            await project_service_1.default.changeOwner(projectId, oldOwnerId, newOwnerId);
            res.status(200).json({
                status: "success",
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
    async getOwnerId(req, res) {
        try {
            const { projectId } = req.params;
            const ownerId = await project_service_1.default.getOwnerId(projectId);
            res.status(200).json({
                status: "success",
                ownerId
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
    async deleteProject(req, res) {
        try {
            const { projectId } = req.params;
            await project_service_1.default.deleteProject(projectId);
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
};
