import { useEffect, useState } from "react";
import FormComponent from "../forms/form-component";
import User, { UserResponse } from "./user-types";
import userService from "./user-service";
import UsersMapper from "./users-mapper";

function UserSearchForm () {
    const [users, setUsers] = useState<UserResponse[]>([]);
    const selectedState = useState<UserResponse[]>([]);
    const [selected, setSelected] = selectedState;

    const fetchUsers = async () => {
        const result = await userService.fetchUsers();
        setUsers([...result.users]);
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
    </FormComponent>
}

export default UserSearchForm;