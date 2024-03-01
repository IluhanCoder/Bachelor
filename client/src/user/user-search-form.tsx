import { useEffect, useState } from "react";
import FormComponent from "../forms/form-component";
import User, { UserResponse } from "./user-types";
import userService from "./user-service";
import UsersMapper from "./users-mapper";

function UserSearchForm () {
    const [users, setUsers] = useState<UserResponse[]>([]);

    const fetchUsers = async () => {
        const result = await userService.fetchUsers();
        setUsers(result.users);
    }

    useEffect(() => {
        fetchUsers()
    }, []);

    return <FormComponent formLabel="пошук користувачів">
        <UsersMapper users={users}/>
    </FormComponent>
}

export default UserSearchForm;