import { ChangeEvent, useState } from "react";
import FormComponent from "../forms/form-component";
import { submitButtonStyle } from "../styles/button-syles";
import backlogService from "./backlog-service";
import formStore from "../forms/form-store";

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
        <form onSubmit={handleSubmit}>
            <div>
                <input type="text" name="name" onChange={handleChange}/>
            </div>
            <button type="submit" className={submitButtonStyle}>створити</button>
        </form>
    </FormComponent>
}

export default NewBacklogForm;