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

    return <FormComponent formLabel={`Завдання "${task.name}"`}>
        <div>{
            sprints.map((sprint: SprintResponse) => <button className={sprint._id === selectedSprintId ? "bg-blue-500" : "bg-white-100"} type="button" onClick={() => handleSelect(sprint._id)}>{sprint.name}</button>)
            }</div>
        <div>
            <button type="button" className={submitButtonStyle} disabled={!selectedSprintId} onClick={handleSubmit}>додати</button>
        </div>
    </FormComponent>
}

export default PushTaskForm;