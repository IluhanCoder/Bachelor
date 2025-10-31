import { useEffect, useState } from "react";
import FormComponent from "../forms/form-component";
import User, { UserResponse } from "../user/user-types";
import userService from "../user/user-service";
import UsersMapper from "../user/users-mapper";
import { submitButtonStyle } from "../styles/button-syles";
import inviteService from "./invite-service";
import formStore from "../forms/form-store";
import userStore from "../user/user-store";
import { ExtendedProjectResponse, ParticipantResponse, ProjectResponse } from "../project/project-types";

interface LocalParams {
    project: ExtendedProjectResponse,
    callBack?: () => {}
}

function InviteForm ({project, callBack}: LocalParams) {
    const [users, setUsers] = useState<UserResponse[]>([]);
    const selectedState = useState<UserResponse[]>([]);
    const [selected, setSelected] = selectedState;

    const fetchUsers = async () => {
        const result = await userService.fetchUsers();
        // Фільтруємо користувачів: виключаємо себе, учасників проєкту та вже запрошених
        const participantIds = project.participants.map((participant: ParticipantResponse) => participant.participant && participant.participant._id);
        const invitedIds = project.invited.map((user: UserResponse) => user._id);
        
        const filteredResult = result.users.filter((user: UserResponse) => 
            user._id !== userStore.user?._id && 
            !participantIds.includes(user._id) && 
            !invitedIds.includes(user._id)
        );
        
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

    return <FormComponent formLabel={`Запросити користувачів до проєкту "${project.name}"`}>
        <div className="space-y-6">
            <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700">
                    Оберіть користувачів для запрошення
                </label>
                <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-xl border-2 border-slate-200 p-4 max-h-96 overflow-y-auto">
                    <UsersMapper users={users} selectedState={selectedState}/>
                </div>
            </div>
            {selected.length > 0 && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 shadow-sm">
                    <div className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                            {selected.length}
                        </div>
                        Обрані користувачі:
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {selected.map((user: UserResponse) => (
                            <div key={user._id} className="bg-white px-4 py-2.5 rounded-lg shadow-sm border-2 border-blue-300 text-blue-800 font-medium flex items-center gap-2 hover:shadow-md transition-shadow">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                                    {user.name?.[0]?.toUpperCase() || user.nickname?.[0]?.toUpperCase()}
                                </div>
                                <span className="font-semibold">{user.nickname}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div className="flex justify-end gap-3 pt-4">
                <button 
                    type="button"
                    onClick={() => formStore.dropForm()}
                    className="px-6 py-2.5 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors"
                >
                    Скасувати
                </button>
                <button 
                    onClick={handleInvite} 
                    className={`
                        px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2
                        ${selected.length > 0
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                            : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        }
                    `}
                    type="button"
                    disabled={selected.length === 0}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    {`Запросити ${selected.length > 1 ? "користувачів" : "користувача"}`}
                </button>
            </div>
        </div>
    </FormComponent>
}

export default InviteForm;