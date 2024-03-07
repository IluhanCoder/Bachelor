import { useEffect, useState } from "react";
import { SprintResponse } from "./sprint-types";
import sprintService from "./sprint-service";
import { TaskResponse } from "../task/task-types";
import SprintTasksMapper from "../task/sprint-tasks-mapper";
import formStore from "../forms/form-store";
import EditSprintForm from "./edit-sprint-form";
import { submitButtonStyle } from "../styles/button-syles";

interface LocalParams {
    sprints: SprintResponse[],
    pullHandler: (taskId: string, sprintId: string) => {},
    assignHandler: (task: TaskResponse) => void,
    callBack?: () => {}
}

function BacklogSprintsMapper({sprints, pullHandler, assignHandler, callBack}: LocalParams) {
    const handleEdit = (sprintId: string) => {
        formStore.setForm(<EditSprintForm sprintId={sprintId} callBack={callBack}/>);
    }

    const isTerminated = (sprint: SprintResponse) => {
        return new Date() > new Date(sprint.endDate);
    }

    return <div>
        {sprints.map((sprint: SprintResponse) => <div className={(isTerminated(sprint)) ? "bg-red-200" : ""}>
            <div>
                <div>{sprint.name}</div>
                <button type="button" onClick={() => handleEdit(sprint._id)} className={submitButtonStyle}>редагувати спрінт</button>
            </div>
            <div>
                <div>завдання спрінту:</div>
                <SprintTasksMapper assignHandler={assignHandler} pullHandler={(taskId: string) => pullHandler(taskId, sprint._id)} sprint={sprint}/>
            </div>
        </div>)}
    </div>
}

export default BacklogSprintsMapper;