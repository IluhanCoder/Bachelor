//users

export interface UserDto {
    _id: string,
    name?: string,
    surname?: string,
    nickname: string,
    email: string,
    organisation: string,
    avatar: {
        data: any,
        contentType: string
    }
}

export type RegisterCredentials = Pick<UserDto, 'nickname' | 'email' | 'organisation' > & { password: string };
export type LoginCredentials = Pick<UserDto, 'nickname' | 'email'> & { password: string };


//tasks

export interface TaskDto {
    _id: string
    name: string,
    desc: string,
    backlogId?: string,
    isChecked: boolean,
    createdBy: string,
    created: Date,
    checkedDate: Date | null,
    executors: string[],
    status: string,
    difficulty: string,
    priority: string,
    requirements: string,
}

export type TaskResponse = TaskDto & {
    executors: UserDto[]
}

export type TaskCredentials = Pick<TaskDto, 'name' | 'desc' | 'backlogId' | 'createdBy' | 'executors' | 'requirements'>;
export type UpdateTaskCredentials = Omit<TaskDto, 'createdBy' | 'created' | 'executors' | 'backlogId'>;


//projects

export interface ProjectDto {
    name: string,
    created: Date,
    lastModified: Date,
    owner: string,
    participants: string[]
}

export type ProjectResponse = ProjectDto & {
    owner: UserDto,
    participants: UserDto[],
    tasks: TaskResponse[],
    invited: UserDto[]
}

export interface Rights {
    create: boolean,
    edit: boolean,
    delete: boolean,
    check: boolean,
    editParticipants: boolean,
    addParticipants: boolean,
    editProjectData: boolean
}

export type ProjectCredentials = Pick<ProjectDto, 'name' | 'owner'>;

export type ParticipantResponse = {
    participant: UserDto,
    rights: Rights
}