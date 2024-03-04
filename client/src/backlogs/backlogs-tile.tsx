import { useEffect, useState } from "react";
import { BacklogResponse } from "./backlog-types";
import backlogService from "./backlog-service";
import { TaskResponse } from "../task/task-types";
import TasksTile from "../task/tasks-tile";

interface LocalParams {
    projectId: string
}

function BacklogTile ({projectId}: LocalParams) {
    const [backlogs, setBackLogs] = useState<BacklogResponse[]>([]);

    const getBacklogs = async () => {
        const result = await backlogService.getProjectBacklogs(projectId);
        setBackLogs([...result.backlogs]);
    }

    useEffect(() => {
        getBacklogs();
    }, []);

    return <div>{backlogs.map((backlog: BacklogResponse) => <div>
        <div>{backlog.name}</div>
        <div>
            <TasksTile backLog={backlog} callBack={getBacklogs} onCheck={getBacklogs}/>
        </div>
    </div>)}</div>
}

export default BacklogTile;