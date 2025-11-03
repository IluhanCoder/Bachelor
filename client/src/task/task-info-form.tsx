import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import FormComponent from "../forms/form-component"
import { TaskResponse } from "./task-types";
import taskService from "./task-service";
import { inputStyle, selectStyle } from "../styles/form-styles";
import ErrorContainer from "../errors/error-container";
import { lightButtonStyle, submitButtonStyle } from "../styles/button-syles";
import formStore from "../forms/form-store";
import { UserResponse } from "../user/user-types";
import AssignForm from "./assign-form";
import DateFormater from "../misc/date-formatter";
import { Rights } from "../project/project-types";
import userStore from "../user/user-store";

interface LocalParams {
    taskId: string,
    projectId: string,
    callBack?: () => void,
    rights: Rights
}

function TaskInfoForm({taskId, callBack, projectId, rights}: LocalParams) {
    const [formData, setFormData] = useState<TaskResponse | null>(null);

    const getTask = async () => {
        const result = await taskService.getTaskById(taskId);
        console.log(result);
        setFormData(result.task);
    }

    useEffect(() => {
        getTask()
    }, []);

    // Check if current user is the creator of the task
    const isCreator = formData && userStore.user && formData.createdBy &&
        (typeof formData.createdBy === 'string' 
            ? formData.createdBy === userStore.user._id 
            : (formData.createdBy as any)._id === userStore.user._id || 
              (formData.createdBy as any).toString() === userStore.user._id);

    // User can edit if they have edit rights OR if they created the task and have create rights
    const canEdit = rights.edit || (isCreator && rights.create);
    
    // User can change status if they have check rights OR if they created the task and have create rights
    const canChangeStatus = rights.check || (isCreator && rights.create);

    // Debug logging
    console.log('Task Info Debug:', {
        taskCreatedBy: formData?.createdBy,
        taskCreatedByType: typeof formData?.createdBy,
        currentUserId: userStore.user?._id,
        isCreator,
        rightsEdit: rights.edit,
        rightsCreate: rights.create,
        rightsCheck: rights.check,
        canEdit,
        canChangeStatus
    });

    const handleChange = (event: any) => {
        if(formData)
            setFormData({
            ...formData,
            [event.target.name]: event.target.value,
            });
    };   

    const handleAddParticipant = () => {
        if(formData) formStore.setForm(<AssignForm task={formData} projectId={projectId}/>);
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if(formData) { 
            await taskService.updateTask(formData._id, formData); 
            formStore.dropForm();
            if(callBack) callBack();
        }
    }

    return <FormComponent formLabel="Task Information">
        <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Date Created */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium">Created:</span>
                    <DateFormater value={formData?.created} dayOfWeek/>
                </div>
            </div>

            {/* Main Fields */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Task
                    </label>
                    <input 
                        disabled={!canEdit} 
                        defaultValue={formData?.name} 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed" 
                        type="text" 
                        onChange={handleChange} 
                        name="name"
                        placeholder="Task name..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <input 
                        disabled={!canEdit} 
                        defaultValue={formData?.desc} 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed" 
                        type="text" 
                        onChange={handleChange} 
                        name="desc"
                        placeholder="Task description..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Requirements
                    </label>
                    <textarea 
                        disabled={!canEdit} 
                        defaultValue={formData?.requirements} 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed resize-none" 
                        onChange={handleChange} 
                        name="requirements"
                        rows={4}
                        placeholder="Requirements for completion..."
                    />
                </div>
            </div>

            {/* Status, Difficulty, Priority */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Status
                    </label>
                    <select 
                        disabled={!canChangeStatus} 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed" 
                        value={formData?.status} 
                        onChange={handleChange} 
                        name="status"
                    >
                        <option value="toDo">to do</option>
                        <option value="inProgress">in progress</option>
                        <option value="done">done</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Складність
                    </label>
                    <select 
                        disabled={!canEdit} 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed" 
                        value={formData?.difficulty} 
                        onChange={handleChange} 
                        name="difficulty"
                    >
                        <option value="low">низька</option>
                        <option value="mid">середня</option>
                        <option value="hight">висока</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Priority
                    </label>
                    <select 
                        disabled={!canEdit} 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed" 
                        value={formData?.priority} 
                        onChange={handleChange} 
                        name="priority"
                    >
                        <option value="low">низький</option>
                        <option value="mid">середній</option>
                        <option value="hight">високий</option>
                    </select>
                </div>
            </div>

            {/* Дата виконання */}
            {formData?.checkedDate && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm text-green-700">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">Виконано:</span>
                        <DateFormater value={formData.checkedDate} dayOfWeek/>
                    </div>
                </div>
            )}

            {/* Виконавці */}
            {formData && formData.executors.length > 0 && (
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                        Призначено виконавцям
                    </label>
                    <div className="flex gap-2 flex-wrap">
                        {formData.executors.map((executor: UserResponse) => (
                            <div key={executor._id} className="bg-blue-50 border border-blue-200 px-4 py-2 rounded-lg text-blue-700 font-medium">
                                {executor.nickname}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Кнопка призначення */}
            {rights.editParticipants && (
                <button 
                    type="button" 
                    className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors font-medium" 
                    onClick={handleAddParticipant}
                >
                    + Призначити користувачам
                </button>
            )}

            <ErrorContainer/>

            {/* Кнопки дій */}
            {(canEdit || canChangeStatus || rights.editParticipants) && (
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button 
                        type="button"
                        onClick={() => formStore.dropForm()}
                        className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                    >
                        Скасувати
                    </button>
                    <button 
                        type="submit" 
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Зберегти зміни
                    </button>
                </div>
            )}
        </form>
    </FormComponent>
}

export default TaskInfoForm