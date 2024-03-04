import $api from "../axios-setup"

export default new class BacklogService {
    async getProjectBacklogs (proejctId: string) {
        return (await $api.get(`/backlogs/${proejctId}`)).data;
    }
}