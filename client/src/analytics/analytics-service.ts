import $api from "../axios-setup";

export default new class AnalyticsService {
    async fetchTasksStamps(projectId: string) {
        return (await $api.post(`/task-stamps/${projectId}`, {})).data;
    }

    async taskAmount(projectId: string, startDate: Date, endDate: Date, isDaily: boolean, userId: string | undefined) {
        return (await $api.post("/analytics/task-amount", {projectId, startDate, endDate, isDaily, userId})).data;
    }
}