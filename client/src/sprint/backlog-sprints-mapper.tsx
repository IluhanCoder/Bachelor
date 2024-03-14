import { useEffect, useState } from "react";
import { SprintResponse } from "./sprint-types";
import sprintService from "./sprint-service";
import { TaskResponse } from "../task/task-types";
import SprintTasksMapper from "../task/sprint-tasks-mapper";
import formStore from "../forms/form-store";
import EditSprintForm from "./edit-sprint-form";
import { lightButtonStyle, submitButtonStyle } from "../styles/button-syles";

interface LocalParams {
    sprints: SprintResponse[],
    pullHandler: (taskId: string, sprintId: string) => {},
    assignHandler: (task: TaskResponse) => void,
    deleteHandler: (taskId: string) => void,
    callBack?: () => {}
}

function BacklogSprintsMapper({sprints, pullHandler, assignHandler, callBack, deleteHandler}: LocalParams) {
    const handleEdit = (sprintId: string) => {
        formStore.setForm(<EditSprintForm sprintId={sprintId} callBack={callBack}/>);
    }

    const isTerminated = (sprint: SprintResponse) => {
        return new Date() > new Date(sprint.endDate);
    }

    return <div className="flex flex-col gap-2">
        {sprints.map((sprint: SprintResponse) => <div className={`flex rounded border px-6 py-3 flex-col ${(isTerminated(sprint)) ? "border-red-500 border-2" : "border"}`}>
            <div className="flex justify-between">
                <div className="text-xl">{sprint.name}</div>
                <button type="button" onClick={() => handleEdit(sprint._id)} className={lightButtonStyle}>редагувати спрінт</button>
            </div>
            <div>
                <div>завдання спрінту:</div>
                <SprintTasksMapper assignHandler={assignHandler} deleteHandler={deleteHandler} pullHandler={(taskId: string) => pullHandler(taskId, sprint._id)} sprint={sprint}/>
            </div>
        </div>)}
    </div>
}

export default BacklogSprintsMapper;