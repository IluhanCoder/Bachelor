import { ChangeEvent, useEffect, useState } from "react";
import FormComponent from "../forms/form-component"
import { TaskResponse } from "./task-types";
import taskService from "./task-service";
import { inputStyle } from "../styles/form-styles";
import ErrorContainer from "../errors/error-container";
import { submitButtonStyle } from "../styles/button-syles";

interface LocalParams {
    taskId: string,
    callBack?: () => void
}

function TaskInfoForm({taskId, callBack}: LocalParams) {
    const [formData, setFormData] = useState<TaskResponse | null>(null);

    const getTask = async () => {
        const result = await taskService.getTaskById(taskId);
        setFormData(result.task);
    }

    useEffect(() => {
        getTask()
    }, []);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if(formData)
            setFormData({
            ...formData,
            [event.target.name]: event.target.value,
            });
    };   

    const handleSubmit = async () => {

    }

    return <FormComponent formLabel="Інформація про завдання">
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2 py-2">
                <div className="flex flex-col gap-2 px-10">
                    <label className="font-bold text-gray-600 text-xs">Задача</label>
                    <input defaultValue={formData?.name} className={inputStyle} type="text" onChange={handleChange} name="name"/>
                </div>
                <div className="flex flex-col gap-2 px-10">
                    <label className="font-bold text-gray-600 text-xs">Опис</label>
                    <input defaultValue={formData?.desc} className={inputStyle} type="text" onChange={handleChange} name="desc"/>
                </div>
            </div>
            <div className="flex justify-center">
                <ErrorContainer/>
            </div>
            <div className="flex w-full mt-4 justify-between gap-10">
                <div>
                    <button type="submit" className={submitButtonStyle}>Зберегти зміни</button>
                </div>
            </div>
        </form>
    </FormComponent>
}

export default TaskInfoForm