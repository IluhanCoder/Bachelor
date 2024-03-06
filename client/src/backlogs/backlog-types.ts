import { SprintResponse } from "../sprint/sprint-types";
import { TaskResponse } from "../task/task-types";

export interface BacklogResponse {
    _id: string,
    name: string,
    projectId: string
}