import { ChangeEvent, useState } from "react";
import FormComponent from "../forms/form-component";
import { TaskResponse } from "../task/task-types";
import { SprintResponse } from "./sprint-types";
import sprintService from "./sprint-service";
import { submitButtonStyle } from "../styles/button-syles";
import formStore from "../forms/form-store";

interface LocalParams {
    task: TaskResponse,
    sprints: SprintResponse[],
    callBack?: () => void
}

function PushTaskForm({task, sprints, callBack}: LocalParams) {
    const [selectedSprintId, setSelectedSprintId] = useState<string | undefined>();

    const handleSelect = (sprintId: string) => {
        setSelectedSprintId(sprintId);
    }

    const handleSubmit = async () => {
        if(selectedSprintId) { 
            await sprintService.pushTask(task._id, selectedSprintId);
            formStore.dropForm();
            if(callBack) callBack();
        }
    }

    return <FormComponent formLabel={`Додати "${task.name}" до спрінту`}>
        <div className="flex flex-col gap-2">
            <div className="grid grid-cols-4 gap-2">{
                sprints.map((sprint: SprintResponse) => <button className={(sprint._id === selectedSprintId ? "text-blue-500 " : "text-black ") + "bg-gray-100 rounded px-2 py-1"} type="button" onClick={() => handleSelect(sprint._id)}>{sprint.name}</button>)
                }</div>
            <div className="flex justify-center">
                <button type="button" className={submitButtonStyle} disabled={!selectedSprintId} onClick={handleSubmit}>додати</button>
            </div>
        </div>
    </FormComponent>
}

export default PushTaskForm;