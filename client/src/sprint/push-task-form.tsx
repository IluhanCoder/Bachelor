import { ChangeEvent, useState } from "react";
import FormComponent from "../forms/form-component";
import { TaskResponse } from "../task/task-types";
import { SprintResponse } from "./sprint-types";
import sprintService from "./sprint-service";
import { submitButtonStyle } from "../styles/button-syles";
import formStore from "../forms/form-store";

interface LocalParams {
    task: TaskResponse,
    sprints: SprintResponse[],
    callBack?: () => void
}

function PushTaskForm({task, sprints, callBack}: LocalParams) {
    const [selectedSprintId, setSelectedSprintId] = useState<string | undefined>();

    const handleSelect = (sprintId: string) => {
        setSelectedSprintId(sprintId);
    }

    const handleSubmit = async () => {
        if(selectedSprintId) { 
            await sprintService.pushTask(task._id, selectedSprintId);
            formStore.dropForm();
            if(callBack) callBack();
        }
    }

    return <FormComponent formLabel={`Додати "${task.name}" до спрінту`}>
        <div className="space-y-6">
            <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                    Оберіть спрінт
                </label>
                <div className="grid grid-cols-2 gap-3">
                    {sprints.map((sprint: SprintResponse) => (
                        <button 
                            key={sprint._id}
                            className={`
                                p-4 rounded-lg border-2 transition-all text-left
                                ${sprint._id === selectedSprintId 
                                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md' 
                                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm text-gray-700'
                                }
                            `}
                            type="button" 
                            onClick={() => handleSelect(sprint._id)}
                        >
                            <div className="font-medium">{sprint.name}</div>
                            {sprint._id === selectedSprintId && (
                                <svg className="w-5 h-5 mt-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <button 
                    type="button"
                    onClick={() => formStore.dropForm()}
                    className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                    Скасувати
                </button>
                <button 
                    type="button" 
                    className={`
                        px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2
                        ${selectedSprintId 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }
                    `}
                    disabled={!selectedSprintId} 
                    onClick={handleSubmit}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add
                </button>
            </div>
        </div>
    </FormComponent>
}

export default PushTaskForm;