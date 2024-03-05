import { Request, Response } from "express";
import sprintService from "./sprint-service";

export default new class SprintController {
    async createSprint(req: Request, res: Response) {
        try {
            const {backlogId, name} = req.body;
            await sprintService.createSprint(backlogId, name);
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

    async getBacklogSprints(req: Request, res: Response) {
        try {
            const {backlogId} = req.params;
            const sprints = await sprintService.getBacklogSprints(backlogId);
            res.status(200).json({
                status: "success",
                sprints
            })
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async getSprintTasks(req: Request, res: Response) {
        try {
            const {sprintId} = req.params;
            const tasks = await sprintService.getSprintTasks(sprintId);
            res.status(200).json({
                status: "success",
                tasks
            })
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async pushTask(req: Request, res: Response) {
        try {
            const {taskId, sprintId} = req.body;
            await sprintService.pushTask(taskId, sprintId);
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

    async pullTask(req: Request, res: Response) {
        try {
            const {taskId, sprintId} = req.body;
            await sprintService.pullTask(taskId, sprintId);
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
}