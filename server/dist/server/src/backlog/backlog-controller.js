"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const backlog_service_1 = __importDefault(require("./backlog-service"));
exports.default = new class BacklogController {
    async getProjectBacklogs(req, res) {
        try {
            const { projectId } = req.params;
            const backlogs = await backlog_service_1.default.getProjectBacklogs(projectId);
            res.status(200).json({
                status: "success",
                backlogs
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
    async createBacklog(req, res) {
        try {
            const { projectId } = req.params;
            const { name } = req.body;
            const userId = req.user?._id;
            if (!userId) {
                return res.status(401).json({
                    status: "fail",
                    message: "Unauthorized"
                });
            }
            const canManage = await backlog_service_1.default.canUserManageBacklog(projectId, userId);
            if (!canManage) {
                return res.status(403).json({
                    status: "fail",
                    message: "You don't have permission to manage backlogs in this project"
                });
            }
            await backlog_service_1.default.createBacklog(projectId, name);
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
    async getBacklogTasks(req, res) {
        try {
            const { backlogId } = req.params;
            const tasks = await backlog_service_1.default.getBacklogTasks(backlogId);
            res.status(200).json({
                status: "success",
                tasks
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
