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
}