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
import LoadingScreen from "../misc/loading-screen";
import { Rights } from "../project/project-types";

interface LocalParams {
    projectId: string,
    rights: Rights
}

export const BacklogContext = createContext<BacklogResponse | undefined>(undefined);

function BacklogMapper ({projectId, rights}: LocalParams) {
    const [backlogs, setBackLogs] = useState<BacklogResponse[] | null>(null);

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

    if(backlogs) return <div className="flex flex-col">
        {backlogs.length > 0 && backlogs.map((backlog: BacklogResponse) => <BacklogCard rights={rights} backlog={backlog}/> ||
        <div className="flex justify-center p-8 text-xl font-bold text-gray-600">беклоги відсутні</div>)}
    </div>
    else return <LoadingScreen/>
}

export default BacklogMapper;