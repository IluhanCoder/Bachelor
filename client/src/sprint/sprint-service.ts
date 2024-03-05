import $api from "../axios-setup"

export default new class SprintService {
    async createSprint(backlogId: string, name: string) {
        return (await $api.post("/sprint", {backlogId, name})).data;
    }

    async getSprints(backlogId: string) {
        return (await $api.get(`/sprints/${backlogId}`)).data;
    }

    async pushTask(taskId: string, sprintId: string) {
        return (await $api.post(`/sprint-task`,{taskId, sprintId})).data;
    }
}