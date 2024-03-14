import $api from "../axios-setup"

export default new class TaskService {
    async getProjectTasks(projectId: string) {
        return (await $api.get(`project-tasks/${projectId}`)).data;
    }

    async newTask (backlogId: string, createdBy: string, name: string, desc: string) {
        return (await $api.post("/task", {task: {backlogId, createdBy, name, desc}})).data;
    }

    async checkTask(taskId: string) {
        return (await $api.patch(`/task-check/${taskId}`)).data;
    }

    async unCheckTask(taskId: string) {
        return (await $api.patch(`/task-uncheck/${taskId}`)).data;
    }

    async getBacklogTasks(backlogId: string) {
        return (await $api.get(`/backlog-tasks/${backlogId}`)).data;
    }

    async getSprintTasks(sprintId: string) {
        return (await $api.get(`/sprint-tasks/${sprintId}`)).data;
    }

    async setStatus(taskId: string, status: number) {
        return (await $api.patch(`/status/${taskId}`, {status})).data;
    }

    async assignTask(taskId: string, userId: string) {
        return (await $api.patch("/assign", {taskId, userId})).data;
    }       

    async deleteTask(taskId: string) {
        return (await $api.delete(`/task/${taskId}`)).data;
    }

    async getTaskById(taskId: string) {
        return (await $api.get(`/task/${taskId}`)).data;
    }
}