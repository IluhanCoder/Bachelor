"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const project_controller_1 = __importDefault(require("./projects/project-controller"));
const user_controller_1 = __importDefault(require("./user/user-controller"));
const invite_controller_1 = __importDefault(require("./invites/invite-controller"));
const task_controller_1 = __importDefault(require("./tasks/task-controller"));
// multer typings may not be installed in this workspace; use require to avoid type import errors
const multer = require("multer");
const backlog_controller_1 = __importDefault(require("./backlog/backlog-controller"));
const sprint_controller_1 = __importDefault(require("./sprints/sprint-controller"));
const analytics_controller_1 = __importDefault(require("./analytics/analytics-controller"));
const router = (0, express_1.Router)();
const upload = multer();
// Health check endpoint for monitoring
router.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
router.post("/project", project_controller_1.default.newProject);
router.get("/user-projects", project_controller_1.default.getUserProjects);
router.get("/project/:id", project_controller_1.default.getProjectById);
router.get("/users", user_controller_1.default.fetchUsers);
router.post("/invite", invite_controller_1.default.createInvite);
router.get("/invited/:projectId", invite_controller_1.default.getInvited);
router.get("/user/:userId", user_controller_1.default.getUserById);
router.get("/invites-to-user", invite_controller_1.default.getInvitesToUser);
router.post("/see-invite/:inviteId", invite_controller_1.default.seeInvite);
router.delete("/leave-project/:projectId", project_controller_1.default.leaveProject);
router.post("/delete-participant/:projectId", project_controller_1.default.deleteParticipant);
router.post("/cancel-invite", invite_controller_1.default.cancelInvite);
router.get(`/project-tasks/:projectId`, task_controller_1.default.getProjectTasks);
router.post(`/task`, task_controller_1.default.addTask);
router.post(`/user-update/:userId`, user_controller_1.default.updateUser);
router.post("/avatar", upload.single("file"), user_controller_1.default.setAvatar);
router.patch("/task-check/:taskId", task_controller_1.default.checkTask);
router.patch("/task-uncheck/:taskId", task_controller_1.default.unCheckTask);
router.get("/backlogs/:projectId", backlog_controller_1.default.getProjectBacklogs);
router.post("/backlog/:projectId", backlog_controller_1.default.createBacklog);
router.post("/sprint", sprint_controller_1.default.createSprint);
router.get("/sprints/:backlogId", sprint_controller_1.default.getBacklogSprints);
router.get("/backlog-tasks/:backlogId", backlog_controller_1.default.getBacklogTasks);
router.get("/sprint-tasks/:sprintId", sprint_controller_1.default.getSprintTasks);
router.post("/sprint-task", sprint_controller_1.default.pushTask);
router.post("/sprint-pull-task", sprint_controller_1.default.pullTask);
router.patch("/status/:taskId", task_controller_1.default.setStatus);
router.patch("/assign", task_controller_1.default.assignTask);
router.get("/participants/:projectId", project_controller_1.default.getParticipants);
router.get("/user-rights/:projectId", project_controller_1.default.getUserRights);
router.post("/analytics/task-amount", analytics_controller_1.default.taskAmount);
router.get("/sprint/:sprintId", sprint_controller_1.default.getSprintById);
router.put("/sprint/:sprintId", sprint_controller_1.default.editSprint);
router.post("/analytics/task-ratio", analytics_controller_1.default.taskRatio);
router.post("/analytics/created-task-amount", analytics_controller_1.default.createdTaskAmount);
router.post("/analytics/predict-ratio", analytics_controller_1.default.predictRatio);
router.post("/analytics/quick-stats", analytics_controller_1.default.getQuickStats);
router.post("/analytics/velocity", analytics_controller_1.default.getVelocityData);
router.post("/analytics/top-contributors", analytics_controller_1.default.getTopContributors);
router.get("/rights/:projectId", project_controller_1.default.getRights);
router.patch("/rights/:projectId", project_controller_1.default.setRights);
router.delete("/task/:taskId", task_controller_1.default.deleteTask);
router.post("/owner/:projectId", project_controller_1.default.changeOwner);
router.get("/task/:taskId", task_controller_1.default.getTaskById);
router.put("/task/:taskId", task_controller_1.default.updateTask);
router.get("/owner/:projectId", project_controller_1.default.getOwnerId);
router.delete("/sprint/:sprintId", sprint_controller_1.default.deleteSprint);
router.delete("/project/:projectId", project_controller_1.default.deleteProject);
exports.default = router;
