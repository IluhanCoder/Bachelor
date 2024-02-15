import $api from "../axios-setup"

export default new class ProjectService {
    async getUserProjects() {
        const result = (await $api.get("/user-projects")).data.projects!;
        return result;
    }

    async newProject(name: string) {
        const result = (await $api.post("/project", {name})).data;
        return result;
    }
}