export default class ProjectError extends Error {
    status: number

    constructor(message, status) {
        super(message);
        this.status = status ?? 500;
    }

    static ProjectNotFound() {
        return new ProjectError("Проект не було знайдено", 400);
    }
}