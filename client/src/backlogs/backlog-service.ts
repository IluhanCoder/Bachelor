import $api from "../axios-setup"

export default new class BacklogService {
    async getProjectBacklogs (proejctId: string) {
        return (await $api.get(`/backlogs/${proejctId}`)).data;
    }

    async createBacklog(projectId: string, name: string) {
        return (await $api.post(`/backlog/${[projectId]}`, {name})).data;
    }
}