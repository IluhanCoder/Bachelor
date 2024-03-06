import { useEffect, useState } from "react";
import { BacklogResponse } from "../backlogs/backlog-types";
import FormComponent from "../forms/form-component";
import { TaskResponse } from "./task-types";
import { UserResponse } from "../user/user-types";
import projectService from "../project/project-service";
import { ParticipantResponse } from "../project/project-types";
import UsersMapper from "../user/users-mapper";
import { submitButtonStyle } from "../styles/button-syles";
import taskService from "./task-service";

interface LocalParams {
    task: TaskResponse,
    projectId: string
}

function AssignForm({task, projectId}: LocalParams) {
    const [users, setUsers] = useState<ParticipantResponse[]>([]);
    const [selected, setSelected] = useState<UserResponse[]>([]);

    const getUsers = async () => {
        const result = await projectService.getParticipants(projectId);
        setUsers([...result.participants]);
    }

    const handleSubmit = async () => {
        selected.map((user: UserResponse) => {
            taskService.assignTask(task._id, user._id);
        })
        
    }

    useEffect(() => {
        getUsers();
    }, [])
 
    return <FormComponent formLabel="Назначити задачу">
        <div>
            <UsersMapper users={users.map((participant: ParticipantResponse) => participant.participant)} selectedState={[selected, setSelected]}/>
            <div>{selected.map((user: UserResponse) => <div>{user.nickname}</div>)}</div>
            <button type="button" className={submitButtonStyle} onClick={handleSubmit}>назначити</button>
        </div>
    </FormComponent>
}

export default AssignForm;