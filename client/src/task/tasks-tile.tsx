import { ChangeEvent, useEffect, useState } from "react";
import { TaskResponse } from "./task-types";
import taskService from "./task-service";
import NewTaskForm from "./new-task-form";
import formStore from "../forms/form-store";
import { submitButtonStyle } from "../styles/button-syles";

interface LocalParams {
    projectId: string
}

function TasksTile ({projectId}: LocalParams) {
    const [tasks, setTasks] = useState<TaskResponse[]>([]);

    const handleNewTask = async() => {
        if(projectId) {
            formStore.setForm(<NewTaskForm projectId={projectId} callBack={getTasks}/>);
        }
    }

    const getTasks = async () => {
        const result = await taskService.getProjectTasks(projectId);
        setTasks([...result.tasks]);
    }

    const handleCheck = async (event: ChangeEvent<HTMLInputElement>) => {
        const {id, checked} = event.target;
        if(checked) await taskService.checkTask(id);
        else await taskService.unCheckTask(id);
        getTasks();
    }

    useEffect(() => {
        getTasks();
    }, [])

    return <div>
        {tasks.map((task: TaskResponse) => {
            return <div className="flex gap-2">
                <div>
                    <input type="checkbox" onChange={(e) => handleCheck(e)} id={task._id}/>
                </div>
                <div className={(task.isChecked ? "underline" : "")}>{task.name}</div>
            </div>
        })}
        <div>
            <button className={submitButtonStyle} type="button" onClick={handleNewTask}>створити задачу</button>
        </div>
    </div>
}

export default TasksTile;