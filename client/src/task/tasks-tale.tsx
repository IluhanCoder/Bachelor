import { useEffect, useState } from "react";
import { TaskResponse } from "./task-types";
import taskService from "./task-service";
import NewTaskForm from "./new-task-form";
import formStore from "../forms/form-store";
import { submitButtonStyle } from "../styles/button-syles";

interface LocalParams {
    projectId: string
}

function TasksTale ({projectId}: LocalParams) {
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

    useEffect(() => {
        getTasks();
    }, [])

    return <div>
        {tasks.map((task: TaskResponse) => {
            return <div>{task.name}</div>
        })}
        <div>
            <button className={submitButtonStyle} type="button" onClick={handleNewTask}>створити задачу</button>
        </div>
    </div>
}

export default TasksTale;