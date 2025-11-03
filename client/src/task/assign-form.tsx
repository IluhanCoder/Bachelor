import { useEffect, useState } from "react";
import { BacklogResponse } from "../backlogs/backlog-types";
import FormComponent from "../forms/form-component";
import { TaskResponse } from "./task-types";
import { UserResponse } from "../user/user-types";
import projectService from "../project/project-service";
import { ParticipantResponse } from "../project/project-types";
import UsersMapper from "../user/users-mapper";
import { submitButtonStyle } from "../styles/button-syles";
import taskService from "./task-service";
import formStore from "../forms/form-store";
import LoadingScreen from "../misc/loading-screen";

interface LocalParams {
    task: TaskResponse,
    projectId: string,
    callBack?: () => void
}

function AssignForm({task, projectId, callBack}: LocalParams) {
    const [users, setUsers] = useState<ParticipantResponse[] | null>(null);
    const [selected, setSelected] = useState<UserResponse[]>([]);

    const getUsers = async () => {
        const result = await projectService.getParticipants(projectId);
        setUsers([...result.participants]);
    }

    const handleSubmit = async () => {
        selected.map(async (user: UserResponse) => {
            await taskService.assignTask(task._id, user._id);
        })
        formStore.dropForm();
        if(callBack) callBack();
    }

    useEffect(() => {
        getUsers();
    }, [])
 
    return <FormComponent formLabel="Assign Task">
        {users && <div className="space-y-6">
            <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                    Select Assignees
                </label>
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 max-h-96 overflow-y-auto">
                    <UsersMapper task={task} users={users.map((participant: ParticipantResponse) => participant.participant)} selectedState={[selected, setSelected]}/>
                </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm font-medium text-blue-900 mb-2">Selected Users:</div>
                {selected.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {selected.map((user: UserResponse) => (
                            <div key={user._id} className="bg-white px-4 py-2 rounded-lg shadow-sm border border-blue-200 text-blue-700 font-medium">
                                {user.nickname}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-sm text-gray-600">no users selected</div>
                )}
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <button 
                    type="button"
                    onClick={() => formStore.dropForm()}
                    className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                    Cancel
                </button>
                <button 
                    type="button" 
                    className={`
                        px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2
                        ${selected.length > 0
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }
                    `}
                    onClick={handleSubmit}
                    disabled={selected.length === 0}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Assign
                </button>
            </div>
        </div> || <div className="w-96"><LoadingScreen/></div>}
    </FormComponent>
}

export default AssignForm;