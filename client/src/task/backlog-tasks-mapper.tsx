import { useEffect, useState } from "react";
import { TaskResponse } from "./task-types";
import taskService from "./task-service";
import TasksMapper from "./tasks-mapper";
import formStore from "../forms/form-store";
import AssignForm from "./assign-form";
import { UserResponse } from "../user/user-types";

interface LocalParams {
    tasks: TaskResponse[],
    assignHandler: (task: TaskResponse) => void,
    pushHandler: (task: TaskResponse) => void,
    deleteHandler: (taskId: string) => void
}

function BacklogTasksMapper ({tasks, pushHandler, assignHandler, deleteHandler}: LocalParams) {
    return <div>{tasks.map((task: TaskResponse) => task.name && <div className="bg-gray-200 m-4">
            <div>{task.name}</div>
            <div>{task.executors.map((executor: UserResponse) => <div>{executor.nickname}</div>)}</div>
            <div className="flex gap-2">
                <button type="button" onClick={() => pushHandler(task)}>додати до спрінту</button>
                <button type="button" onClick={() => assignHandler(task)}>назначити</button>
                <button type="button" onClick={() => deleteHandler(task._id)}>видалити</button>
            </div>
        </div>
    )}</div>
}

export default BacklogTasksMapper;