"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProjectError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status ?? 500;
    }
    static ProjectNotFound() {
        return new ProjectError("Проект не було знайдено", 400);
    }
}
exports.default = ProjectError;
