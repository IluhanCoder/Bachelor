import { useEffect, useState } from "react";
import { SprintResponse } from "./sprint-types";
import sprintService from "./sprint-service";
import { TaskResponse } from "../task/task-types";
import SprintTasksMapper from "../task/sprint-tasks-mapper";

interface LocalParams {
    sprints: SprintResponse[],
    pullHandler: (taskId: string, sprintId: string) => {}
}

function BacklogSprintsMapper({sprints, pullHandler}: LocalParams) {
    return <div>
        {sprints.map((sprint: SprintResponse) => <div>
            <div>{sprint.name}</div>
            <div>
                <div>завдання спрінту:</div>
                <SprintTasksMapper pullHandler={(taskId: string) => pullHandler(taskId, sprint._id)} sprint={sprint}/>
            </div>
        </div>)}
    </div>
}

export default BacklogSprintsMapper;