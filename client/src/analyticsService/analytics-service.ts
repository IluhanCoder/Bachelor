import $api from "../axios-setup";

export default new class AnalyticsService {
    async fetchTasksStamps(projectId: string) {
        return (await $api.post(`/task-stamps/${projectId}`, {})).data;
    }

    async taskAmount(projectId: string, startDate: Date, endDate: Date, isDaily: boolean) {
        return (await $api.post("/analytics/task-amount", {projectId, startDate, endDate, isDaily})).data;
    }
}