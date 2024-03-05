import { useEffect, useState } from "react";
import { SprintResponse } from "./sprint-types";
import sprintService from "./sprint-service";
import { TaskResponse } from "../task/task-types";
import SprintTasksMapper from "../task/sprint-tasks-mapper";

interface LocalParams {
    backlogId: string,
}

function SprintsTile({backlogId}: LocalParams) {
    const [sprints, setSprints] = useState<SprintResponse[]>([]);

    const getSprints = async () => {
        const result = await sprintService.getSprints(backlogId);
        setSprints([...result.sprints]);
    }

    useEffect(() => { getSprints() }, []);

    return <div>
        {sprints.map((sprint: SprintResponse) => <div>
            <div>{sprint.name}</div>
            <div>
                <div>завдання спрінту:</div>
                <SprintTasksMapper sprintId={sprint._id}/>
            </div>
        </div>)}
    </div>
}

export default SprintsTile;