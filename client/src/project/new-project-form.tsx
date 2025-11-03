import FormComponent from "../forms/form-component";
import { FormEvent, useState, ChangeEvent } from "react";
import errorStore from "../errors/error-store";
import { ProjectCredentials } from "./project-types";
import userStore from "../user/user-store";
import formStore from "../forms/form-store";
import projectService from "./project-service";
import { submitButtonStyle } from "../styles/button-syles";
import { inputStyle } from "../styles/form-styles";
import ErrorContainer from "../errors/error-container";

interface LocalParams {
    callBack: () => void
}

function NewProjectForm({callBack}: LocalParams) {
    const [formData, setFormData] = useState<ProjectCredentials>({
        name: "",
        owner: userStore.user?._id!
    });

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        errorStore.dropErrors();

        if(formData.name.length === 0) {
            errorStore.pushError("All fields must be filled");
            return;
        }        const result = await projectService.newProject(formData.name);
    
        if(result?.status === "success") { 
            formStore.dropForm();
            callBack();
        }
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
            setFormData({
            ...formData,
            [event.target.name]: event.target.value,
            });
    };   

    return <FormComponent formLabel="New Project">
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Project Name <span className="text-red-500">*</span>
                </label>
                <input 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                    name="name" 
                    type="text" 
                    onChange={handleChange}
                    placeholder="Enter project name..."
                    required
                />
            </div>
            <ErrorContainer/>
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

export default NewProjectForm;