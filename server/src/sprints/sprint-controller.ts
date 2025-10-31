import { Request, Response } from "express";
import sprintService from "./sprint-service";
import { AuthenticatedRequest } from "../auth/auth-types";

export default new class SprintController {
    async createSprint(req: AuthenticatedRequest, res: Response) {
        try {
            const {backlogId, name, goal, startDate, endDate} = req.body;
            const currentUserId = req.user?._id;
            
            if (!currentUserId) {
                return res.status(401).json({
                    status: "fail",
                    message: "unauthorized"
                });
            }

            // Check if user can manage sprints in this backlog
            const canManage = await sprintService.canUserManageSprintByBacklog(backlogId, currentUserId);
            
            if (!canManage) {
                return res.status(403).json({
                    status: "fail",
                    message: "You don't have permission to manage sprints in this project"
                });
            }

            await sprintService.createSprint(
                backlogId, 
                name, 
                goal || "", 
                new Date(startDate), 
                new Date(endDate)
            );
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

    async editSprint(req: AuthenticatedRequest, res: Response) {
        try {
            const {sprintId} = req.params;
            const {name, goal, startDate, endDate} = req.body;
            const currentUserId = req.user?._id;
            
            if (!currentUserId) {
                return res.status(401).json({
                    status: "fail",
                    message: "unauthorized"
                });
            }

            // Check if user can manage this sprint
            const canManage = await sprintService.canUserManageSprint(sprintId, currentUserId);
            
            if (!canManage) {
                return res.status(403).json({
                    status: "fail",
                    message: "You don't have permission to manage this sprint"
                });
            }

            await sprintService.editSprint(sprintId, name, goal, new Date(startDate), new Date(endDate));
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

    async getSprintById(req: Request, res: Response) {
        try {
            const {sprintId} = req.params;
            const sprint = await sprintService.getSprintById(sprintId);
            res.status(200).json({
                status: "success",
                sprint
            });
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }
    
    async deleteSprint(req: AuthenticatedRequest, res: Response) {
        try {
            const {sprintId} = req.params;
            const currentUserId = req.user?._id;
            
            if (!currentUserId) {
                return res.status(401).json({
                    status: "fail",
                    message: "unauthorized"
                });
            }

            // Check if user can manage this sprint
            const canManage = await sprintService.canUserManageSprint(sprintId, currentUserId);
            
            if (!canManage) {
                return res.status(403).json({
                    status: "fail",
                    message: "You don't have permission to manage this sprint"
                });
            }

            await sprintService.deleteSprint(sprintId);
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
}