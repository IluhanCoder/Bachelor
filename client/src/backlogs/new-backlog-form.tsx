import { ChangeEvent, useState } from "react";
import FormComponent from "../forms/form-component";
import { submitButtonStyle } from "../styles/button-syles";
import backlogService from "./backlog-service";
import formStore from "../forms/form-store";
import { inputStyle } from "../styles/form-styles";

interface LocalParams {
    projectId: string,
    callBack?: () => {}
}

function NewBacklogForm ({callBack, projectId}: LocalParams) {
    const [formData, setFormData] = useState<{name: string}>({name: ""});

    const handleSubmit = async () => {
        await backlogService.createBacklog(projectId, formData.name);
        formStore.dropForm();
        if(callBack) callBack();
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormData({
        ...formData,
        [event.target.name]: event.target.value,
        });
    };  

    return <FormComponent formLabel="Create Backlog">
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Backlog Name <span className="text-red-500">*</span>
                </label>
                <input 
                    type="text" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                    name="name" 
                    onChange={handleChange}
                    placeholder="Enter backlog name..."
                    required
                />
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
                    type="submit" 
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create
                </button>
            </div>
        </form>
    </FormComponent>
}

export default NewBacklogForm;