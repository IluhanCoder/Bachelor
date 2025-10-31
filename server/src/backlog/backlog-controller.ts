import { Request, Response } from "express";
import backlogService from "./backlog-service";

interface AuthenticatedRequest extends Request {
    user?: {
        _id: string;
        email: string;
    };
}

export default new class BacklogController {
    async getProjectBacklogs(req: Request, res: Response) {
        try {
            const {projectId} = req.params;
            const backlogs = await backlogService.getProjectBacklogs(projectId);
            res.status(200).json({
                status: "success",
                backlogs
            })
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }        
    }

    async createBacklog(req: AuthenticatedRequest, res: Response) {
        try {
            const {projectId} = req.params;
            const {name} = req.body;
            
            const userId = req.user?._id;
            if (!userId) {
                return res.status(401).json({
                    status: "fail",
                    message: "Unauthorized"
                });
            }

            const canManage = await backlogService.canUserManageBacklog(projectId, userId);
            if (!canManage) {
                return res.status(403).json({
                    status: "fail",
                    message: "You don't have permission to manage backlogs in this project"
                });
            }

            await backlogService.createBacklog(projectId, name);
            res.status(200).json({
                status: "success",
            })
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async getBacklogTasks(req: Request, res: Response) {
        try {
            const {backlogId} = req.params;
            const tasks = await backlogService.getBacklogTasks(backlogId);
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
}