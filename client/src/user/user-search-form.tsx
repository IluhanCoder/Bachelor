import { useEffect, useState } from "react";
import FormComponent from "../forms/form-component";
import User, { UserResponse } from "./user-types";
import userService from "./user-service";

function UserSearchForm () {
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserResponse[]>([]);

    const fetchUsers = async () => {
        const result = await userService.fetchUsers();
        setUsers(result.users);
        setFilteredUsers(result.users);
    }

    const handleFilter = (filter: string) => {
        const newUsers: UserResponse[] | undefined = users.filter((user: UserResponse) => user.nickname.includes(filter) || user.name.includes(filter) || user.surname.includes(filter) || user.email.includes(filter) || user.organisation.includes(filter));
        setFilteredUsers(newUsers ?? []);
    }

    useEffect(() => {
        fetchUsers()
    }, []);

    return <FormComponent formLabel="пошук користувачів">
        <div className="flex flex-col gap-2 p-2">
            <div>
                <input type="text" onChange={(e) => handleFilter(e.target.value)}/>
            </div>
            <div>
                {filteredUsers.map((user: UserResponse) => {
                    return <div>{user.name}</div>
                })}
            </div>
        </div>
    </FormComponent>
}

export default UserSearchForm;