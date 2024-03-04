import { ChangeEvent, useEffect, useState } from "react";
import { TaskResponse } from "./task-types";
import taskService from "./task-service";
import NewTaskForm from "./new-task-form";
import formStore from "../forms/form-store";
import { submitButtonStyle } from "../styles/button-syles";
import { BacklogResponse } from "../backlogs/backlog-types";

interface LocalParams {
    backLog: BacklogResponse,
    callBack?: () => {},
    onCheck?: () => {}
}

function TasksTile ({backLog, callBack, onCheck}: LocalParams) {
    const handleNewTask = async (task: TaskResponse) => {
        formStore.setForm(<NewTaskForm backlogId={backLog._id} projectId={task.projectId} callBack={callBack}/>);
    }

    const handleCheck = async (event: ChangeEvent<HTMLInputElement>) => {
        const {id, checked} = event.target;
        if(checked) await taskService.checkTask(id);
        else await taskService.unCheckTask(id);
        if(onCheck) onCheck();
    }

    return <div>
        {backLog.tasks.map((task: TaskResponse) => {
            return <div className="flex gap-2">
                <div>
                    <input type="checkbox" checked={task.isChecked} onChange={(e) => handleCheck(e)} id={task._id}/>
                </div>
                <div className={(task.isChecked ? "underline" : "")}>{task.name}</div>
            </div>
        })}
        {backLog.tasks.length > 0 && <div>
            <button className={submitButtonStyle} type="button" onClick={() => handleNewTask(backLog.tasks[0])}>створити задачу</button>
        </div>}
    </div>
}

export default TasksTile;