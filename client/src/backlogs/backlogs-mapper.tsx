import { createContext, useEffect, useState } from "react";
import { BacklogResponse } from "./backlog-types";
import backlogService from "./backlog-service";
import { TaskResponse } from "../task/task-types";
import BacklogTasksMapper from "../task/backlog-tasks-mapper";
import { submitButtonStyle } from "../styles/button-syles";
import NewTaskForm from "../task/new-task-form";
import formStore from "../forms/form-store";
import BacklogSprintsMapper from "../sprint/backlog-sprints-mapper";
import NewSprintForm from "../sprint/new-sprint-form";
import BacklogCard from "./backlog-card";

interface LocalParams {
    projectId: string
}

export const BacklogContext = createContext<BacklogResponse | undefined>(undefined);

function BacklogMapper ({projectId}: LocalParams) {
    const [backlogs, setBackLogs] = useState<BacklogResponse[]>([]);

    const getBacklogs = async () => {
        const result = await backlogService.getProjectBacklogs(projectId);
        setBackLogs([...result.backlogs]);
    }

    const handleNewTask = async (backlogId: string) => {
        formStore.setForm(<NewTaskForm backlogId={backlogId} callBack={getBacklogs}/>);
    }

    const handleNewSprint = async (backlogId: string) => {
        formStore.setForm(<NewSprintForm backlogId={backlogId} callBack={getBacklogs}/>);
    }

    useEffect(() => {
        getBacklogs();
    }, []);

    return <div>
        <div>
            {backlogs.map((backlog: BacklogResponse) => <BacklogCard backlog={backlog}/>)}
        </div>
    </div>
}

export default BacklogMapper;