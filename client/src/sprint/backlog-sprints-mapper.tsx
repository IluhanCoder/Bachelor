import { useEffect, useState } from "react";
import { SprintResponse } from "./sprint-types";
import sprintService from "./sprint-service";
import { TaskResponse } from "../task/task-types";
import SprintTasksMapper from "../task/sprint-tasks-mapper";
import formStore from "../forms/form-store";
import EditSprintForm from "./edit-sprint-form";
import { lightButtonStyle, redButtonSyle, submitButtonStyle } from "../styles/button-syles";
import { Rights } from "../project/project-types";

interface LocalParams {
    sprints: SprintResponse[],
    pullHandler: (taskId: string, sprintId: string) => {},
    assignHandler: (task: TaskResponse) => void,
    deleteHandler: (taskId: string) => void,
    detailsHandler: (taskId: string) => void,
    callBack?: () => {},
    rights: Rights
}

function BacklogSprintsMapper({sprints, pullHandler, assignHandler, callBack, deleteHandler, detailsHandler, rights}: LocalParams) {
    const handleEdit = (sprintId: string) => {
        formStore.setForm(<EditSprintForm sprintId={sprintId} callBack={callBack}/>);
    }

    const handleDelete = async (sprintId: string) => {
        await sprintService.deleteSprint(sprintId);
        if(callBack) callBack();
    }

    const isTerminated = (sprint: SprintResponse) => {
        return new Date() > new Date(sprint.endDate);
    }

    return <div className="flex flex-col gap-2">
        {sprints.length > 0 && sprints.map((sprint: SprintResponse) => <div className={`flex rounded border px-6 py-3 flex-col ${(isTerminated(sprint)) ? "border-red-500 border-2" : "border"}`}>
            <div className="flex justify-between">
                <div className="text-xl">{sprint.name}</div>
                <div className="flex gap-2">
                    {rights.edit && <button type="button" onClick={() => handleEdit(sprint._id)} className={lightButtonStyle}>редагувати спрінт</button>}
                    {rights.delete && <button type="button" onClick={() => handleDelete(sprint._id)} className={redButtonSyle}>видалити спрінт</button>}
                </div>
            </div>
            <div>
                <div>задачі спрінту:</div>
                <SprintTasksMapper rights={rights} detailsHandler={detailsHandler} assignHandler={assignHandler} deleteHandler={deleteHandler} pullHandler={(taskId: string) => pullHandler(taskId, sprint._id)} sprint={sprint}/>
            </div>
        </div>) || <div className="flex justify-center p-8 text-xl font-bold text-gray-600">спрінти відсутні</div> }
    </div>
}

export default BacklogSprintsMapper;