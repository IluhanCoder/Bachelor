import { ChangeEvent, useEffect, useState } from "react";
import { TaskResponse } from "./task-types";
import taskService from "./task-service";
import NewTaskForm from "./new-task-form";
import formStore from "../forms/form-store";
import { submitButtonStyle } from "../styles/button-syles";
import { BacklogResponse } from "../backlogs/backlog-types";

interface LocalParams {
    tasks: TaskResponse[],
    onCheck?: () => {}
}

function TasksMapper ({tasks, onCheck}: LocalParams) {
    const handleCheck = async (event: ChangeEvent<HTMLInputElement>) => {
        const {id, checked} = event.target;
        if(checked) await taskService.checkTask(id);
        else await taskService.unCheckTask(id);
        if(onCheck) onCheck();
    }

    return <div>
        {tasks.map((task: TaskResponse) => {
            return <div className="flex gap-2">
                <div>
                    <input type="checkbox" checked={task.isChecked} onChange={(e) => handleCheck(e)} id={task._id}/>
                </div>
                <div className={(task.isChecked ? "underline" : "")}>{task.name}</div>
            </div>
        })}
    </div>
}

export default TasksMapper;