import { useEffect, useState } from "react";
import { TaskResponse } from "./task-types";
import taskService from "./task-service";
import TasksMapper from "./tasks-mapper";
import formStore from "../forms/form-store";
import AssignForm from "./assign-form";
import { UserResponse } from "../user/user-types";
import { lightButtonStyle, redButtonSyle } from "../styles/button-syles";

interface LocalParams {
    tasks: TaskResponse[],
    assignHandler: (task: TaskResponse) => void,
    pushHandler: (task: TaskResponse) => void,
    deleteHandler: (taskId: string) => void
}

function BacklogTasksMapper ({tasks, pushHandler, assignHandler, deleteHandler}: LocalParams) {
    return <div className="flex flex-col gap-1">{tasks.map((task: TaskResponse) => task.name && <div className="rounded py-2 pl-10 pr-4 gap-6 border-2 flex justify-between">
            <div className="text-xl font-bold mt-0.5">{task.name}</div>
            {task.executors.length > 0 && <div className="flex gap-2 mt-1">
                <div>призначено:</div>
                <div>{task.executors.map((executor: UserResponse) => <div>{executor.nickname}</div>)}</div>
            </div>}
            <div className="flex gap-2 text-xs">
                <button type="button" className={lightButtonStyle} onClick={() => pushHandler(task)}>додати до спрінту</button>
                <button type="button" className={lightButtonStyle} onClick={() => assignHandler(task)}>назначити</button>
                <button type="button" className={redButtonSyle} onClick={() => deleteHandler(task._id)}>видалити</button>
            </div>
        </div>
    )}</div>
}

export default BacklogTasksMapper;