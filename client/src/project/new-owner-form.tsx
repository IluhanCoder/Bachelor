import { useEffect, useState } from "react";
import { UserResponse } from "../user/user-types";
import userStore from "../user/user-store";
import userService from "../user/user-service";
import projectService from "./project-service";
import formStore from "../forms/form-store";
import FormComponent from "../forms/form-component";
import UsersMapper from "../user/users-mapper";
import { submitButtonStyle } from "../styles/button-syles";
import { ParticipantResponse, ProjectResponse } from "./project-types";

interface LocalParams{
    project: ProjectResponse,
    callBack?: () => void
}

function NewOwnerForm({project, callBack}: LocalParams) {
    const [users, setUsers] = useState<UserResponse[]>([]);
    const selectedState = useState<UserResponse[]>([]);
    const [selected, setSelected] = selectedState;

    const fetchUsers = async () => {
        const result = await userService.fetchUsers();
        const filteredResult = result.users.filter((user: UserResponse) => user !== userStore.user && project.participants.map((participant: ParticipantResponse) => participant.participant && participant.participant._id).includes(user._id));
        setUsers([...filteredResult]);
    }

    const handleInvite = async () => {
        if(selected.length > 0 && userStore.user?._id) {
            try {
                await projectService.changeOwner(project._id, selected[0]._id, userStore.user?._id);
                if(callBack) callBack();
            } catch (error) {
                throw error;
            }
            formStore.dropForm();
        }
    }

    useEffect(() => {
        fetchUsers()
    }, []);

    return <FormComponent formLabel="пошук користувачів">
        <div className="flex flex-col gap-2">
            <UsersMapper users={users} selectedState={selectedState}/>
            <div className="flex gap-2">
                {selected.map((user: UserResponse) => <div>{
                    user.nickname
                }</div>)}
            </div>
        </div>
        <div>
            <button onClick={handleInvite} className={submitButtonStyle} type="button">{`Передати проект користувачу`}</button>
        </div>
    </FormComponent>
}

export default NewOwnerForm;