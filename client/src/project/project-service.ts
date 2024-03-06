import $api from "../axios-setup"
import { ProjectResponse } from "./project-types";

export default new class ProjectService {
    async getUserProjects() {
        const result: ProjectResponse[] = (await $api.get("/user-projects")).data.projects!;
        return result;
    }

    async newProject(name: string) {
        const result = (await $api.post("/project", {name})).data;
        return result;
    }

    async getProjectById(id: string) {
        const result = (await $api.get(`/project/${id}`)).data;
        return result;
    }

    async leaveProject(projectId: string) {
        const result = (await $api.delete(`/leave-project/${projectId}`)).data;
        return result;
    }

    async deleteParticipant(projectId: string, userId: string) {
        const result = (await $api.post(`delete-participant/${projectId}`, {userId})).data;
        return result;
    }

    async getParticipants(projectId: string) {
        const result = (await $api.get(`/participants/${projectId}`)).data;
        return result;
    }
}