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
        const newUsers: UserResponse[] | undefined = users.filter((user: UserResponse) => 
            (user.nickname.includes(filter) || 
             user.name.includes(filter) || 
             user.surname.includes(filter) || 
             user.email.includes(filter) || 
             user.organisation.includes(filter)) && 
            !task?.executors.find((executor: UserResponse) => executor._id === user._id)
        );
        setFilteredUsers(newUsers || users);
    }

    const handleSelect = (newSelected: UserResponse) => {
        if(selected.includes(newSelected)) return;
        setSelected([...selected, newSelected])
    }

    const handleDeselect = (deselected: UserResponse) => {
        const result = selected.filter((user: UserResponse) => user !== deselected);
        setSelected([...result]);
    }

    return <div className="space-y-4">
        {/* Пошук */}
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input 
                className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all bg-white placeholder-slate-400 text-slate-800" 
                type="search" 
                onChange={(e) => handleFilter(e.target.value)}
                placeholder="Пошук за ім'ям, прізвищем, email або організацією..."
            />
        </div>

        {/* Список користувачів */}
        {filteredUsers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredUsers.map((user: UserResponse) => {
                    const isSelected = selected.includes(user);
                    return (
                        <button 
                            key={user._id}
                            type="button" 
                            className={`
                                relative p-4 rounded-xl border-2 transition-all text-left
                                ${isSelected 
                                    ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg shadow-blue-100' 
                                    : 'border-gray-200 bg-white hover:border-blue-200 hover:shadow-md hover:bg-blue-50/30'
                                }
                            `}
                            onClick={() => (isSelected) ? handleDeselect(user) : handleSelect(user)}
                        >
                            {/* Чекмарк */}
                            {isSelected && (
                                <div className="absolute top-3 right-3">
                                    <div className="bg-blue-600 rounded-full p-1">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            )}

                            {/* Avatar placeholder */}
                            <div className="flex items-start gap-3">
                                <div className={`
                                    w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0
                                    shadow-md
                                    ${isSelected 
                                        ? 'bg-gradient-to-br from-blue-400 to-indigo-500 text-white' 
                                        : 'bg-gradient-to-br from-slate-200 to-slate-300 text-slate-700'
                                    }
                                `}>
                                    {user.name?.[0]?.toUpperCase() || user.nickname?.[0]?.toUpperCase() || '?'}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className={`font-semibold text-base ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                                        {user.nickname}
                                    </div>
                                    {(user.name || user.surname) && (
                                        <div className={`text-sm mt-0.5 ${isSelected ? 'text-blue-700' : 'text-slate-600'}`}>
                                            {user.name} {user.surname}
                                        </div>
                                    )}
                                    {user.email && (
                                        <div className={`text-xs mt-1 flex items-center gap-1 ${isSelected ? 'text-blue-600' : 'text-slate-500'}`}>
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                            </svg>
                                            <span className="truncate">{user.email}</span>
                                        </div>
                                    )}
                                    {user.organisation && (
                                        <div className={`text-xs mt-1 flex items-center gap-1 ${isSelected ? 'text-blue-600' : 'text-slate-500'}`}>
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                                            </svg>
                                            <span className="truncate">{user.organisation}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </button>
                    );
                })} 
            </div>
        ) : (
            <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <p className="text-sm font-medium text-slate-700">Користувачів не знайдено</p>
                <p className="text-xs text-slate-500 mt-1">Try changing search parameters</p>
            </div>
        )}
    </div>
}

export default UsersMapper;