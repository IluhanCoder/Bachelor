import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import FormComponent from "../forms/form-component"
import { TaskResponse } from "./task-types";
import taskService from "./task-service";
import { inputStyle } from "../styles/form-styles";
import ErrorContainer from "../errors/error-container";
import { submitButtonStyle } from "../styles/button-syles";
import formStore from "../forms/form-store";

interface LocalParams {
    taskId: string,
    callBack?: () => void
}

function TaskInfoForm({taskId, callBack}: LocalParams) {
    const [formData, setFormData] = useState<TaskResponse | null>(null);

    const getTask = async () => {
        const result = await taskService.getTaskById(taskId);
        console.log(result);
        setFormData(result.task);
    }

    useEffect(() => {
        getTask()
    }, []);

    const handleChange = (event: any) => {
        if(formData)
            setFormData({
            ...formData,
            [event.target.name]: event.target.value,
            });
    };   

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if(formData) { 
            await taskService.updateTask(formData._id, formData); 
            formStore.dropForm();
            if(callBack) callBack();
        }
    }

    return <FormComponent formLabel="Інформація про завдання">
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2 py-2">
                <div className="flex flex-col gap-2 px-10">
                    <label className="font-bold text-gray-600 text-xs w-96">Задача</label>
                    <input defaultValue={formData?.name} className={inputStyle} type="text" onChange={handleChange} name="name"/>
                </div>
                <div className="flex flex-col gap-2 px-10">
                    <label className="font-bold text-gray-600 text-xs">Опис</label>
                    <input defaultValue={formData?.desc} className={inputStyle} type="text" onChange={handleChange} name="desc"/>
                </div>
                <div className="flex flex-col gap-2 px-10">
                    <label className="font-bold text-gray-600 text-xs">Вимоги</label>
                    <textarea defaultValue={formData?.requirements} className={inputStyle} onChange={handleChange} name="requirements"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div>Статус</div>
                        <select value={formData?.status} onChange={handleChange} name="status">
                            <option value="toDo">треба виконати</option>
                            <option value="inProgress" className="text-blue-600">в процесі</option>
                            <option value="done" className="text-green-600">виконано</option>
                        </select>
                    </div>
                    <div>
                        <div>Складність</div>
                        <select value={formData?.difficulty} onChange={handleChange} name="difficulty">
                            <option value="low">низька</option>
                            <option value="mid" className="text-blue-600">середня</option>
                            <option value="hight" className="text-green-600">висока</option>
                        </select>
                    </div>
                </div>
                <div>
                    <div>Пріоритет</div>
                    <select value={formData?.priority} onChange={handleChange} name="priority">
                        <option value="low">низький</option>
                        <option value="mid" className="text-blue-600">середній</option>
                        <option value="hight" className="text-green-600">високий</option>
                    </select>
                </div>
            </div>
            <div className="flex justify-center">
                <ErrorContainer/>
            </div>
            <div className="flex w-full mt-4 justify-center">
                <button type="submit" className={submitButtonStyle}>Зберегти зміни</button>
            </div>
        </form>
    </FormComponent>
}

export default TaskInfoForm