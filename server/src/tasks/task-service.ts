import Task, { TaskCredentials } from "./task-types";
import mongoose from "mongoose";
import TaskModel from "./task-model";

export default new class TaskService {
    async addTask(newTask: TaskCredentials) {
        try {
            const task: Task = {
                name: newTask.name,
                desc: newTask.desc,
                projectId: new mongoose.Types.ObjectId(newTask.projectId),
                isChecked: false,
                createdBy: new mongoose.Types.ObjectId(newTask.createdBy),
                created: new Date(),
                checkedDate: undefined,
                executors: newTask.executors ?? []
            };
            await TaskModel.create;
        } catch (error) {
            throw error;
        }
    }
}