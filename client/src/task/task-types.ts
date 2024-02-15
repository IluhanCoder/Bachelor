interface Task {
    name: string,
    desc: string,
    projectId: string,
    isChecked: boolean,
    createdBy: string,
    created: Date,
    checkedDate: Date | undefined,
    executors: string[]
}

export default Task;

export interface TaskCredentials {
    name: string,
    desc: string,
    projectId: string,
    createdBy: string,
    executors?: string[]
}