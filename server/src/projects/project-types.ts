import mongoose from "mongoose";
import { UserResponse } from "../user/user-type";
import Task from "../tasks/task-types";

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
    participant: mongoose.Types.ObjectId,
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
    tasks: Task[],
    participants: ParticipantResponse[]
}

interface Project {
    name: string,
    created: Date,
    lastModified: Date,
    owner: mongoose.Types.ObjectId,
    participants: Participant[]
}

export default Project;