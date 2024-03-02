import { ChangeEvent, FormEvent, useState } from "react";
import FormComponent from "../forms/form-component";
import { submitButtonStyle } from "../styles/button-syles";
import { TaskCredentials } from "./task-types";
import userStore from "../user/user-store";
import taskService from "./task-service";
import formStore from "../forms/form-store";

interface LocalParams {
    projectId: string,
    callBack?: () => {}
}

function NewTaskForm({projectId, callBack}: LocalParams) {
    const [formData, setFormData] = useState<TaskCredentials>({
        name: "",
        desc: "",
        createdBy: userStore.user?._id ?? "",
        projectId
    });

    const handleSubmit = async(event: FormEvent) => {
        event.preventDefault();
        await taskService.newTask(formData.projectId, formData.createdBy, formData.name, formData.desc);
        if(callBack) callBack();
        formStore.dropForm();
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    }; 

    return <FormComponent formLabel="Нове Завдання">
        <form onSubmit={handleSubmit}>
            <div>
                <label>назва</label>
                <input type="text" name="name" onChange={handleChange}></input>
            </div>
            <div>
                <label>опис</label>
                <input type="text" name="desc" onChange={handleChange}></input>
            </div>
            <button className={submitButtonStyle} type="submit">створити</button>
        </form>
    </FormComponent>
}

export default NewTaskForm;