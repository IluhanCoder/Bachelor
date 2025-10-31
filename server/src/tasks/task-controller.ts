import { Request, Response } from "express";
import taskService from "./task-service";
import { AuthenticatedRequest } from "../auth/auth-types";

export default new class TaskController {
    async addTask(req: Request, res: Response) {
        try {
            const { task } = req.body;
            await taskService.addTask( task );
            return res.json({
                status: "success",
                message: "задачу було успішно додано"
            }).status(200);
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async getProjectTasks(req: Request, res: Response) {
        try {
            const { projectId } = req.params;
            const result = await taskService.getProjectTasks(projectId);
            res.status(200).json({
                status: "success",
                tasks: result
            })
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async checkTask(req: Request, res: Response) {
        try {
            const { taskId } = req.params;
            await taskService.checkTask(taskId);
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

    async unCheckTask(req: Request, res: Response) {
        try {
            const { taskId } = req.params;
            await taskService.unCheckTask(taskId);
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

    async setStatus(req: AuthenticatedRequest, res: Response) {
        try {
            const {taskId} = req.params;
            const {status} = req.body;
            const currentUserId = req.user?._id;
            
            if (!currentUserId) {
                return res.status(401).json({
                    status: "fail",
                    message: "unauthorized"
                });
            }

            // Check if user can change status of this task
            const canChangeStatus = await taskService.canUserChangeStatus(taskId, currentUserId);
            
            if (!canChangeStatus) {
                return res.status(403).json({
                    status: "fail",
                    message: "You don't have permission to change status of this task"
                });
            }

            await taskService.setStatus(taskId, Number(status));
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

    async assignTask(req: Request, res: Response) {
        try {
            const {taskId, userId} = req.body;
            await taskService.assignTask(taskId, userId);
            res.status(200).json({
                status: "success"
            });
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async deleteTask(req: AuthenticatedRequest, res: Response) {
        try {
            const {taskId} = req.params;
            const currentUserId = req.user?._id;
            
            if (!currentUserId) {
                return res.status(401).json({
                    status: "fail",
                    message: "unauthorized"
                });
            }

            // Check if user can delete this task
            const canDelete = await taskService.canUserDeleteTask(taskId, currentUserId);
            
            if (!canDelete) {
                return res.status(403).json({
                    status: "fail",
                    message: "You don't have permission to delete this task"
                });
            }

            await taskService.deleteTask(taskId);
            res.status(200).json({
                status: "success"
            });
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async getTaskById(req: Request, res: Response) {
        try {
            const {taskId} = req.params;
            const task = await taskService.getTaskById(taskId);
            res.status(200).json({
                status: "success",
                task
            });
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async updateTask(req: AuthenticatedRequest, res: Response) {
        try {
            const {taskId} = req.params;
            const {task} = req.body;
            const currentUserId = req.user?._id;
            
            if (!currentUserId) {
                return res.status(401).json({
                    status: "fail",
                    message: "unauthorized"
                });
            }

            // Check if user can edit this task
            const canEdit = await taskService.canUserEditTask(taskId, currentUserId);
            
            if (!canEdit) {
                return res.status(403).json({
                    status: "fail",
                    message: "You don't have permission to edit this task"
                });
            }

            await taskService.updateTask(taskId, task);
            res.status(200).json({
                status: "success",
                task
            });
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }
}