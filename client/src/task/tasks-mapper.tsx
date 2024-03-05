import { ChangeEvent, useContext, useEffect, useState } from "react";
import { TaskResponse } from "./task-types";
import taskService from "./task-service";
import NewTaskForm from "./new-task-form";
import formStore from "../forms/form-store";
import { submitButtonStyle } from "../styles/button-syles";
import { BacklogResponse } from "../backlogs/backlog-types";
import PushTaskForm from "../sprint/push-task-form";
import { BacklogContext } from "../backlogs/backlogs-tile";
import { SprintResponse } from "../sprint/sprint-types";
import sprintService from "../sprint/sprint-service";

interface LocalParams {
    tasks: TaskResponse[],
    push: boolean,
    onCheck?: () => {}
}

function TasksMapper ({tasks, onCheck, push}: LocalParams) {
    const currentBackLog = useContext(BacklogContext);

    const handleCheck = async (event: ChangeEvent<HTMLInputElement>) => {
        const {id, checked} = event.target;
        if(checked) await taskService.checkTask(id);
        else await taskService.unCheckTask(id);
        if(onCheck) onCheck();
    }

    const [sprints, setSprints] = useState<SprintResponse[]>([]);

    const getSprints = async () => {
        if(currentBackLog) {
            const result = await sprintService.getSprints(currentBackLog?._id);
            setSprints([...result.sprints])
        }
    }

    useEffect(() => { getSprints() }, []);

    const handleSprintPush = (task: TaskResponse) => {
        formStore.setForm(<PushTaskForm sprints={sprints} task={task}/>)
    }

    return <div>
        {tasks.map((task: TaskResponse) => {
            return <div className="flex gap-2">
                <div>
                    <input type="checkbox" checked={task.isChecked} onChange={(e) => handleCheck(e)} id={task._id}/>
                </div>
                <div className={(task.isChecked ? "underline" : "")}>{task.name}</div>
                {push && <div><button type="button" onClick={() => handleSprintPush(task)} className={submitButtonStyle}>додати в спрінт</button></div> || 
                    <div><button type="button" className={submitButtonStyle}>прибрати зі спрінту</button></div>}
            </div>
        })}
    </div>
}

export default TasksMapper;