import { useEffect, useState } from "react";
import { UserResponse } from "./user-types";
import { inputStyle } from "../styles/form-styles";
import { TaskResponse } from "../task/task-types";

interface LocalParams {
    users: UserResponse[],
    selectedState: [UserResponse[], React.Dispatch<React.SetStateAction<UserResponse[]>>],
    task?: TaskResponse
}

function UsersMapper({ users, selectedState, task }: LocalParams) {
    const [filteredUsers, setFilteredUsers] = useState<UserResponse[]>([]);
    const [selected, setSelected] = selectedState;

    useEffect(() => {
        setFilteredUsers([...users]);
    }, [users])

    const handleFilter = (filter: string) => {
        const newUsers: UserResponse[] | undefined = users.filter((user: UserResponse) => (user.nickname.includes(filter) || user.name.includes(filter) || user.surname.includes(filter) || user.email.includes(filter) || user.organisation.includes(filter)) && !task?.executors.find((executor: UserResponse) => { console.log(executor._id); console.log(user._id); return executor._id === user._id }));
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

    return <div className="flex flex-col gap-4 p-2">
        <div className="w-full flex gap-2">
            <div className="mt-1">Пошук:</div>
            <input className={inputStyle + " w-full h-8"} type="search" onChange={(e) => handleFilter(e.target.value)}/>
        </div>
        <div className="grid grid-cols-4 gap-2">
            {filteredUsers.map((user: UserResponse) => {
                const isSelected = selected.includes(user);
                return <button type="button" className={"bg-gray-100 rounded px-2 py-1 " + (isSelected && "text-blue-600")} onClick={() => (isSelected) ? handleDeselect(user) : handleSelect(user)}>{user.nickname}</button>
            })} 
    </div>
</div>
}

export default UsersMapper;