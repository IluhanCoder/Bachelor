import { Router } from "express";
import authController from "./auth/auth-controller";
import projectController from "./projects/project-controller";
import userController from "./user/user-controller";
import inviteController from "./invites/invite-controller";
import taskController from "./tasks/task-controller";
import multer from "multer";
import backlogController from "./backlog/backlog-controller";
import sprintController from "./sprints/sprint-controller";

const router = Router();

const upload = multer();

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
router.get(`/project-tasks/:projectId`, taskController.getProjectTasks);
router.post(`/task`, taskController.addTask);
router.post(`/user-update/:userId`, userController.updateUser);
router.post("/avatar", upload.single("file"), userController.setAvatar);
router.patch("/task-check/:taskId", taskController.checkTask);
router.patch("/task-uncheck/:taskId", taskController.unCheckTask);
router.get("/backlogs/:projectId", backlogController.getProjectBacklogs);
router.post("/backlog/:projectId", backlogController.createBacklog);
router.post("/sprint", sprintController.createSprint);
router.get("/sprints/:backlogId", sprintController.getBacklogSprints);
router.get("/backlog-tasks/:backlogId", backlogController.getBacklogTasks);
router.get("/sprint-tasks/:sprintId", sprintController.getSprintTasks);
router.post("/sprint-task", sprintController.pushTask);
router.post("/sprint-pull-task", sprintController.pullTask);
router.patch("/status/:taskId", taskController.setStatus);
router.patch("/assign", taskController.assignTask);
router.get("/participants/:projectId", projectController.getParticipants);

export default router;