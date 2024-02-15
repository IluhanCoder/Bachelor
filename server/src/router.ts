import { Router } from "express";
import authController from "./auth/auth-controller";
import projectController from "./projects/project-controller";

const router = Router();

router.post("/project", projectController.newProject);
router.get("/user-projects", projectController.getUserProjects);

export default router;