import { Request, Response } from "express";
import projectService from "./project-service";
import { AuthenticatedRequest } from "../auth/auth-types";

export default new class ProjectController {
    async newProject(req: AuthenticatedRequest, res: Response) {
        try {
            const { name } = req.body;
            const owner = req.user;
            const result = await projectService.createProject({name, owner: owner._id});
            return res.json({
                status: "success",
                projectId: result._id
            }).status(200);
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async getProjectById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await projectService.getProjectById(id);
            return res.json({
                status: "success",
                project: result
            })
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }

    async getUserProjects(req: AuthenticatedRequest, res: Response) {
        try {
            const { user } = req;
            const projects = await projectService.getUserProjects(user._id.toString());
            res.json({
                status: "success",
                projects
            }).status(500);
        } catch (error) {
            res.json({
                status: "fail",
                message: "internal server error"
            }).status(500)
            throw error;
        }
    }
}