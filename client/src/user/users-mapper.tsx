import { useState } from "react";
import { UserResponse } from "./user-types";

interface LocalParams {
    users: UserResponse[]
}

function UsersMapper({ users }: LocalParams) {
    const [filteredUsers, setFilteredUsers] = useState<UserResponse[]>([]);

    const handleFilter = (filter: string) => {
        const newUsers: UserResponse[] | undefined = users.filter((user: UserResponse) => user.nickname.includes(filter) || user.name.includes(filter) || user.surname.includes(filter) || user.email.includes(filter) || user.organisation.includes(filter));
        setFilteredUsers(newUsers ?? []);
    }

    return <div className="flex flex-col gap-2 p-2">
        <div>
            <input type="text" onChange={(e) => handleFilter(e.target.value)}/>
        </div>
        <div>
            {filteredUsers.map((user: UserResponse) => {
                return <div>{user.name}</div>
            })}
    </div>
</div>
}

export default UsersMapper;