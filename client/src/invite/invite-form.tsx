import { useEffect, useState } from "react";
import FormComponent from "../forms/form-component";
import User, { UserResponse } from "../user/user-types";
import userService from "../user/user-service";
import UsersMapper from "../user/users-mapper";
import { submitButtonStyle } from "../styles/button-syles";
import inviteService from "./invite-service";
import formStore from "../forms/form-store";
import userStore from "../user/user-store";
import { ParticipantResponse, ProjectResponse } from "../project/project-types";

interface LocalParams {
    project: ProjectResponse,
    callBack?: () => {}
}

function InviteForm ({project, callBack}: LocalParams) {
    const [users, setUsers] = useState<UserResponse[]>([]);
    const selectedState = useState<UserResponse[]>([]);
    const [selected, setSelected] = selectedState;

    const fetchUsers = async () => {
        const result = await userService.fetchUsers();
        const filteredResult = result.users.filter((user: UserResponse) => user !== userStore.user && !project.participants.map((participant: ParticipantResponse) => participant.participant && participant.participant._id).includes(user._id));
        setUsers([...filteredResult]);
    }

    const handleInvite = async () => {
        if(selected.length > 0) {
            try {
                await inviteService.createInvite(selected, project._id)
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
            <button onClick={handleInvite} className={submitButtonStyle} type="button">{`Запросити ${(selected.length > 1) ? "користувачів" : "користувача"} в проект`}</button>
        </div>
    </FormComponent>
}

export default InviteForm;