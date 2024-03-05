import { createContext, useEffect, useState } from "react";
import { BacklogResponse } from "./backlog-types";
import backlogService from "./backlog-service";
import { TaskResponse } from "../task/task-types";
import BacklogTasksMapper from "../task/backlog-tasks-mapper";
import { submitButtonStyle } from "../styles/button-syles";
import NewTaskForm from "../task/new-task-form";
import formStore from "../forms/form-store";
import SprintsTile from "../sprint/sprints-tile";
import NewSprintForm from "../sprint/new-sprint-form";

interface LocalParams {
    projectId: string
}

export const BacklogContext = createContext<BacklogResponse | undefined>(undefined);

function BacklogTile ({projectId}: LocalParams) {
    const [backlogs, setBackLogs] = useState<BacklogResponse[]>([]);

    const getBacklogs = async () => {
        const result = await backlogService.getProjectBacklogs(projectId);
        setBackLogs([...result.backlogs]);
    }

    const handleNewTask = async (backlogId: string) => {
        formStore.setForm(<NewTaskForm backlogId={backlogId} projectId={projectId} callBack={getBacklogs}/>);
    }

    const handleNewSprint = async (backlogId: string) => {
        formStore.setForm(<NewSprintForm backlogId={backlogId} callBack={getBacklogs}/>);
    }

    useEffect(() => {
        getBacklogs();
    }, []);

    return <div>{backlogs.map((backlog: BacklogResponse) => <BacklogContext.Provider value={backlog}><div>
        <div>{backlog.name}</div>
        <div>
            <label>спрінти:</label>
            <div>
                <SprintsTile onPull={getBacklogs} backlogId={backlog._id}/>
                <div>
                    <button className={submitButtonStyle} type="button" onClick={() => handleNewSprint(backlog._id)}>створити спрінт</button>
                </div>
            </div>
        </div>
        <div>
            <BacklogTasksMapper onPush={getBacklogs} backlogId={backlog._id}/>
            <div>
                <button className={submitButtonStyle} type="button" onClick={() => handleNewTask(backlog._id)}>створити задачу</button>
            </div>
        </div>
    </div></BacklogContext.Provider>)}</div>
}

export default BacklogTile;