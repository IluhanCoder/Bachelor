import { TaskResponse } from "../task/task-types";

export interface SprintResponse {
    _id: string,
    name: string,
    goal: string,
    startDate: Date,
    endDate: Date,
    tasks: TaskResponse[]
}