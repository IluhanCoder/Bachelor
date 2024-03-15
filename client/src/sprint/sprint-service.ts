import $api from "../axios-setup"
import { SprintPutRequest } from "./sprint-types";

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

    async pullTask(taskId: string, sprintId: string) {
        return (await $api.post("/sprint-pull-task",{taskId, sprintId})).data;
    }
    
    async editSprint(sprintId: string, newData: SprintPutRequest) {
        return (await $api.put(`/sprint/${sprintId}`, {...newData})).data;
    }

    async getSprintById(sprintId: string) {
        return (await $api.get(`/sprint/${sprintId}`)).data;
    }

    async deleteSprint(sprintId: string) {
        return (await $api.delete(`/sprint/${sprintId}`)).data;
    }
}