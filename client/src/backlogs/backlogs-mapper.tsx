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

    if(backlogs) return (
        <div className="space-y-4">
            {backlogs.length > 0 ? (
                backlogs.map((backlog: BacklogResponse) => (
                    <BacklogCard key={backlog._id} rights={rights} backlog={backlog}/>
                ))
            ) : (
                <div className="text-center py-12">
                    <svg className="mx-auto w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-700 mb-1">No backlogs available</h3>
                    <p className="text-gray-500">Create a backlog to start working on the project</p>
                </div>
            )}
        </div>
    );
    else return <LoadingScreen/>;
}

export default BacklogMapper;