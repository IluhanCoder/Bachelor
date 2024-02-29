import { Router } from "express";
import authController from "./auth/auth-controller";
import projectController from "./projects/project-controller";
import userController from "./user/user-controller";

const router = Router();

router.post("/project", projectController.newProject);
router.get("/user-projects", projectController.getUserProjects);
router.get("/project/:id", projectController.getProjectById);
router.get("/users", userController.fetchUsers);

export default router;