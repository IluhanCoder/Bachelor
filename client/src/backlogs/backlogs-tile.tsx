import { useEffect, useState } from "react";
import { BacklogResponse } from "./backlog-types";
import backlogService from "./backlog-service";
import { TaskResponse } from "../task/task-types";
import TasksTile from "../task/tasks-tile";
import { submitButtonStyle } from "../styles/button-syles";
import NewTaskForm from "../task/new-task-form";
import formStore from "../forms/form-store";

interface LocalParams {
    projectId: string
}

function BacklogTile ({projectId}: LocalParams) {
    const [backlogs, setBackLogs] = useState<BacklogResponse[]>([]);

    const getBacklogs = async () => {
        const result = await backlogService.getProjectBacklogs(projectId);
        console.log(result);
        setBackLogs([...result.backlogs]);
    }

    const handleNewTask = async (backlogId: string) => {
        formStore.setForm(<NewTaskForm backlogId={backlogId} projectId={projectId} callBack={getBacklogs}/>);
    }

    useEffect(() => {
        getBacklogs();
    }, []);

    return <div>{backlogs.map((backlog: BacklogResponse) => <div>
        <div>{backlog.name}</div>
        <div>
            <TasksTile backLog={backlog} callBack={getBacklogs} onCheck={getBacklogs}/>
            <div>
                <button className={submitButtonStyle} type="button" onClick={() => handleNewTask(backlog._id)}>створити задачу</button>
            </div>
        </div>
    </div>)}</div>
}

export default BacklogTile;