import $api from "../axios-setup"

export default new class TaskService {
    async getProjectTasks(projectId: string) {
        return (await $api.get(`project-tasks/${projectId}`)).data;
    }

    async newTask (projectId: string, createdBy: string, name: string, desc: string) {
        return (await $api.post("/task", {task: {projectId, createdBy, name, desc}})).data;
    }

    async checkTask(taskId: string) {
        return (await $api.patch(`/task-check/${taskId}`)).data;
    }

    async unCheckTask(taskId: string) {
        return (await $api.patch(`/task-uncheck/${taskId}`)).data;
    }
}