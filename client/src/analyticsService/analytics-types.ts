import { TaskResponse } from "../task/task-types";

export interface TasksAnalyticsResponse {
    date: Date,
    task: TaskResponse | number
}