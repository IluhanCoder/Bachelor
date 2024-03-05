import { useEffect, useState } from "react";
import { TaskResponse } from "./task-types";
import taskService from "./task-service";
import TasksMapper from "./tasks-mapper";

interface LocalParams {
    tasks: TaskResponse[],
    pushHandler: (task: TaskResponse) => {}
}

function BacklogTasksMapper ({tasks, pushHandler}: LocalParams) {
    return <div>{tasks.map((task: TaskResponse) => <div className="bg-gray-200 m-4">
            <div>{task.name}</div>
            <div>
                <button type="button" onClick={() => pushHandler(task)}>додати до спрінту</button>
            </div>
        </div>
    )}</div>
}

export default BacklogTasksMapper;