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
        <div className="space-y-6">
            <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                    Оберіть нового власника проекту
                </label>
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 max-h-96 overflow-y-auto">
                    <UsersMapper users={users} selectedState={selectedState}/>
                </div>
            </div>
            {selected.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-sm font-medium text-blue-900 mb-2">Обраний користувач:</div>
                    <div className="flex flex-wrap gap-2">
                        {selected.map((user: UserResponse) => (
                            <div key={user._id} className="bg-white px-4 py-2 rounded-lg shadow-sm border border-blue-200 text-blue-700 font-medium">
                                {user.nickname}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div className="flex justify-end gap-3 pt-4">
                <button 
                    type="button"
                    onClick={() => formStore.dropForm()}
                    className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                    Скасувати
                </button>
                <button 
                    onClick={handleInvite} 
                    className={`
                        px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2
                        ${selected.length > 0
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }
                    `}
                    type="button"
                    disabled={selected.length === 0}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    Передати проект
                </button>
            </div>
        </div>
    </FormComponent>
}

export default NewOwnerForm;