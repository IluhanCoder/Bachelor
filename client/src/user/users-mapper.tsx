import { useEffect, useState } from "react";
import { UserResponse } from "./user-types";

interface LocalParams {
    users: UserResponse[],
    selectedState: [UserResponse[], React.Dispatch<React.SetStateAction<UserResponse[]>>]
}

function UsersMapper({ users, selectedState }: LocalParams) {
    const [filteredUsers, setFilteredUsers] = useState<UserResponse[]>([]);
    const [selected, setSelected] = selectedState;

    useEffect(() => {
        setFilteredUsers([...users]);
    }, [users])

    const handleFilter = (filter: string) => {
        const newUsers: UserResponse[] | undefined = users.filter((user: UserResponse) => user.nickname.includes(filter) || user.name.includes(filter) || user.surname.includes(filter) || user.email.includes(filter) || user.organisation.includes(filter));
        setFilteredUsers([...newUsers] ?? [...users]);
    }

    const handleSelect = (newSelected: UserResponse) => {
        if(selected.includes(newSelected)) return;
        setSelected([...selected, newSelected])
    }

    const handleDeselect = (deselected: UserResponse) => {
        const result = selected.filter((user: UserResponse) => user !== deselected);
        setSelected([...result]);
    }

    return <div className="flex flex-col gap-2 p-2">
        <div>
            <input type="text" onChange={(e) => handleFilter(e.target.value)}/>
        </div>
        <div className="flex flex-col gap-2 p-2">
            {filteredUsers.map((user: UserResponse) => {
                const isSelected = selected.includes(user);
                return <button type="button" className={"p-2 bg-gray-100 rounded shadow-sm border-1 " + (isSelected && "text-blue-500")} onClick={() => (isSelected) ? handleDeselect(user) : handleSelect(user)}>{user.nickname}</button>
            })} 
    </div>
</div>
}

export default UsersMapper;