import $api from "../axios-setup";

export default new class AnalyticsService {
    async fetchTasksStamps(projectId: string) {
        return (await $api.post(`/task-stamps/${projectId}`, {})).data;
    }

    async taskAmount(projectId: string, startDate: Date, endDate: Date, isDaily: boolean, userId: string | undefined) {
        return (await $api.post("/analytics/task-amount", {projectId, startDate, endDate, isDaily, userId})).data;
    }

    async taskRatio(projectId: string, startDate: Date, endDate: Date, daily: boolean, userId: string | undefined) {
        return (await $api.post("/analytics/task-ratio", {projectId, startDate, endDate, daily, userId})).data;
    }

    async createdTaskAmount(projectId: string, startDate: Date, endDate: Date, daily: boolean, userId: string | undefined) {
        return (await $api.post("analytics/created-task-amount", {projectId, startDate, endDate, daily, userId})).data;
    }

    async predictRatio(projectId: string, userId: string | undefined) {
        return (await $api.post("/analytics/predict-ratio", {projectId, userId})).data;
    }

    async getQuickStats(projectId: string, userId: string | undefined) {
        return (await $api.post("/analytics/quick-stats", {projectId, userId})).data;
    }

    async getVelocityData(projectId: string) {
        return (await $api.post("/analytics/velocity", {projectId})).data;
    }

    async getTopContributors(projectId: string) {
        return (await $api.post("/analytics/top-contributors", {projectId})).data;
    }
}