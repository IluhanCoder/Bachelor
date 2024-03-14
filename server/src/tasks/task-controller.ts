import { Request, Response } from "express";
import taskService from "./task-service";

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

    async setStatus(req: Request, res: Response) {
        try {
            const {taskId} = req.params;
            const {status} = req.body;
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

    async deleteTask(req: Request, res: Response) {
        try {
            const {taskId} = req.params;
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
}