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

    return <FormComponent formLabel="створення Backlog">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-10">
            <div className="flex flex-col gap-1">
                <input type="text" className={inputStyle} name="name" onChange={handleChange}/>
            </div>
            <div className="flex justify-center">
                <button type="submit" className={submitButtonStyle}>створити</button>
            </div>
        </form>
    </FormComponent>
}

export default NewBacklogForm;