import { Request, Response } from "express";
import analyticsService from "./analytics-service";

export default new class AnalyticsController {
    async fetchTasksStamps(req: Request, res: Response) {
        try {
            const {projectId} = req.params;
            const {startDate, endDate} = req.body;
            const result = await analyticsService.fetchTasksStamps(projectId);
            res.status(200).json({
                status: "success",
                result
            });
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500);
            throw error;
        }
    }

    async taskAmount(req: Request, res: Response) {
        try {
            const {projectId, startDate, endDate, isDaily} = req.body;
            const result = await analyticsService.taskAmount(projectId, new Date(startDate), new Date(endDate), isDaily);
            res.status(200).json({
                status: "success",
                result
            })
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500);
            throw error;
        }
    }
}