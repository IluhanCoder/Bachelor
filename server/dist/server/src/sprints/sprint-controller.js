"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sprint_service_1 = __importDefault(require("./sprint-service"));
exports.default = new class SprintController {
    async createSprint(req, res) {
        try {
            const { backlogId, name, goal, startDate, endDate } = req.body;
            const currentUserId = req.user?._id;
            if (!currentUserId) {
                return res.status(401).json({
                    status: "fail",
                    message: "unauthorized"
                });
            }
            // Check if user can manage sprints in this backlog
            const canManage = await sprint_service_1.default.canUserManageSprintByBacklog(backlogId, currentUserId);
            if (!canManage) {
                return res.status(403).json({
                    status: "fail",
                    message: "You don't have permission to manage sprints in this project"
                });
            }
            await sprint_service_1.default.createSprint(backlogId, name, goal || "", new Date(startDate), new Date(endDate));
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
    async getBacklogSprints(req, res) {
        try {
            const { backlogId } = req.params;
            const sprints = await sprint_service_1.default.getBacklogSprints(backlogId);
            res.status(200).json({
                status: "success",
                sprints
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
    async getSprintTasks(req, res) {
        try {
            const { sprintId } = req.params;
            const tasks = await sprint_service_1.default.getSprintTasks(sprintId);
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
    async pushTask(req, res) {
        try {
            const { taskId, sprintId } = req.body;
            await sprint_service_1.default.pushTask(taskId, sprintId);
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
    async pullTask(req, res) {
        try {
            const { taskId, sprintId } = req.body;
            await sprint_service_1.default.pullTask(taskId, sprintId);
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
    async editSprint(req, res) {
        try {
            const { sprintId } = req.params;
            const { name, goal, startDate, endDate } = req.body;
            const currentUserId = req.user?._id;
            if (!currentUserId) {
                return res.status(401).json({
                    status: "fail",
                    message: "unauthorized"
                });
            }
            // Check if user can manage this sprint
            const canManage = await sprint_service_1.default.canUserManageSprint(sprintId, currentUserId);
            if (!canManage) {
                return res.status(403).json({
                    status: "fail",
                    message: "You don't have permission to manage this sprint"
                });
            }
            await sprint_service_1.default.editSprint(sprintId, name, goal, new Date(startDate), new Date(endDate));
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
    async getSprintById(req, res) {
        try {
            const { sprintId } = req.params;
            const sprint = await sprint_service_1.default.getSprintById(sprintId);
            res.status(200).json({
                status: "success",
                sprint
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
    async deleteSprint(req, res) {
        try {
            const { sprintId } = req.params;
            const currentUserId = req.user?._id;
            if (!currentUserId) {
                return res.status(401).json({
                    status: "fail",
                    message: "unauthorized"
                });
            }
            // Check if user can manage this sprint
            const canManage = await sprint_service_1.default.canUserManageSprint(sprintId, currentUserId);
            if (!canManage) {
                return res.status(403).json({
                    status: "fail",
                    message: "You don't have permission to manage this sprint"
                });
            }
            await sprint_service_1.default.deleteSprint(sprintId);
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
