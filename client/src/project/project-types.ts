import { TaskResponse } from "../task/task-types"
import User, { UserResponse } from "../user/user-types"

export interface Rights {
    create: boolean,
    edit: boolean,
    delete: boolean,
    check: boolean,
    editParticipants: boolean,
    addParticipants: boolean,
    editProjectData: boolean
}

export interface Participant {
    participant: string,
    rights: Rights
}

export interface ParticipantResponse {
    participant: UserResponse,
    right: Rights
}

export interface ProjectCredentials {
    name: string,
    owner: string
}

export interface ProjectResponse {
    name: string,
    created: Date,
    lastModified: Date,
    owner: UserResponse,
    tasks: TaskResponse[],
    participants: ParticipantResponse[]
}

interface Project {
    name: string,
    created: Date,
    lastModified: Date,
    owner: string,
    participants: Participant[]
}

export default Project;