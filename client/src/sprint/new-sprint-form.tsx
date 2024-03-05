import { ChangeEvent, FormEvent, FormEventHandler, useState } from "react";
import FormComponent from "../forms/form-component";
import { submitButtonStyle } from "../styles/button-syles";
import formStore from "../forms/form-store";
import sprintService from "./sprint-service";

interface LocalParams {
    backlogId: string,
    callBack?: () => void
}

function NewSprintForm ({callBack, backlogId}: LocalParams) {
    const [formData, setFormData] = useState<{name: string}>({name: ""});

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        await sprintService.createSprint(backlogId, formData.name);
        formStore.dropForm();
        if(callBack) callBack();
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormData({
        ...formData,
        [event.target.name]: event.target.value,
        });
    };  

    return <FormComponent formLabel="створення спрінту">
        <form onSubmit={(event: FormEvent) => handleSubmit(event)}>
            <div>
                <input type="text" name="name" onChange={handleChange}/>
            </div>
            <button type="submit" className={submitButtonStyle}>створити</button>
        </form>
    </FormComponent>
}

export default NewSprintForm;