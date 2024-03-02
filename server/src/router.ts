import { Router } from "express";
import authController from "./auth/auth-controller";
import projectController from "./projects/project-controller";
import userController from "./user/user-controller";
import inviteController from "./invites/invite-controller";

const router = Router();

router.post("/project", projectController.newProject);
router.get("/user-projects", projectController.getUserProjects);
router.get("/project/:id", projectController.getProjectById);
router.get("/users", userController.fetchUsers);
router.post("/invite", inviteController.createInvite);
router.get("/invited/:projectId", inviteController.getInvited);
router.get("/user/:userId", userController.getUserById);
router.get("/invites-to-user", inviteController.getInvitesToUser);
router.post("/see-invite/:inviteId", inviteController.seeInvite);
router.delete("/leave-project/:projectId", projectController.leaveProject);
router.post("/delete-participant/:projectId", projectController.deleteParticipant);
router.post("/cancel-invite", inviteController.cancelInvite);

export default router;