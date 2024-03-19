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
            errorStore.pushError("Всі поля мають бути заповнені");
            return;
        }
    
        const result = await projectService.newProject(formData.name);
    
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

    return <FormComponent formLabel="Новий проект">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 px-10">
            <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-600 text-xs">назва проекту:</label>
                <input className={inputStyle} name="name" type="text" onChange={handleChange}/>
            </div>
            <div className="flex justify-center">
                <ErrorContainer/>
            </div>
            <div className="flex justify-center">
                <button type="submit" className={submitButtonStyle}>створити</button>
            </div>
        </form>
    </FormComponent>
}

export default NewProjectForm;