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
}