"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const task_service_1 = __importDefault(require("./task-service"));
exports.default = new class TaskController {
    async addTask(req, res) {
        try {
            const { task } = req.body;
            await task_service_1.default.addTask(task);
            return res.json({
                status: "success",
                message: "задачу було успішно додано"
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
    async getProjectTasks(req, res) {
        try {
            const { projectId } = req.params;
            const result = await task_service_1.default.getProjectTasks(projectId);
            res.status(200).json({
                status: "success",
                tasks: result
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
    async checkTask(req, res) {
        try {
            const { taskId } = req.params;
            await task_service_1.default.checkTask(taskId);
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
    async unCheckTask(req, res) {
        try {
            const { taskId } = req.params;
            await task_service_1.default.unCheckTask(taskId);
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
    async setStatus(req, res) {
        try {
            const { taskId } = req.params;
            const { status } = req.body;
            const currentUserId = req.user?._id;
            if (!currentUserId) {
                return res.status(401).json({
                    status: "fail",
                    message: "unauthorized"
                });
            }
            // Check if user can change status of this task
            const canChangeStatus = await task_service_1.default.canUserChangeStatus(taskId, currentUserId);
            if (!canChangeStatus) {
                return res.status(403).json({
                    status: "fail",
                    message: "You don't have permission to change status of this task"
                });
            }
            await task_service_1.default.setStatus(taskId, Number(status));
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
    async assignTask(req, res) {
        try {
            const { taskId, userId } = req.body;
            await task_service_1.default.assignTask(taskId, userId);
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
    async deleteTask(req, res) {
        try {
            const { taskId } = req.params;
            const currentUserId = req.user?._id;
            if (!currentUserId) {
                return res.status(401).json({
                    status: "fail",
                    message: "unauthorized"
                });
            }
            // Check if user can delete this task
            const canDelete = await task_service_1.default.canUserDeleteTask(taskId, currentUserId);
            if (!canDelete) {
                return res.status(403).json({
                    status: "fail",
                    message: "You don't have permission to delete this task"
                });
            }
            await task_service_1.default.deleteTask(taskId);
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
    async getTaskById(req, res) {
        try {
            const { taskId } = req.params;
            const task = await task_service_1.default.getTaskById(taskId);
            res.status(200).json({
                status: "success",
                task
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
    async updateTask(req, res) {
        try {
            const { taskId } = req.params;
            const { task } = req.body;
            const currentUserId = req.user?._id;
            if (!currentUserId) {
                return res.status(401).json({
                    status: "fail",
                    message: "unauthorized"
                });
            }
            // Check if user can edit this task
            const canEdit = await task_service_1.default.canUserEditTask(taskId, currentUserId);
            if (!canEdit) {
                return res.status(403).json({
                    status: "fail",
                    message: "You don't have permission to edit this task"
                });
            }
            await task_service_1.default.updateTask(taskId, task);
            res.status(200).json({
                status: "success",
                task
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
