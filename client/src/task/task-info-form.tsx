import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import FormComponent from "../forms/form-component"
import { TaskResponse } from "./task-types";
import taskService from "./task-service";
import { inputStyle, selectStyle } from "../styles/form-styles";
import ErrorContainer from "../errors/error-container";
import { lightButtonStyle, submitButtonStyle } from "../styles/button-syles";
import formStore from "../forms/form-store";
import { UserResponse } from "../user/user-types";
import AssignForm from "./assign-form";
import DateFormater from "../misc/date-formatter";

interface LocalParams {
    taskId: string,
    projectId: string,
    callBack?: () => void
}

function TaskInfoForm({taskId, callBack, projectId}: LocalParams) {
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

    const handleAddParticipant = () => {
        if(formData) formStore.setForm(<AssignForm task={formData} projectId={projectId}/>);
    }

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
            <div className="flex gap-2 py-2">
                <div>Створено:</div>
                <div><DateFormater value={formData?.created} dayOfWeek/></div>
            </div>
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
                <div className="grid grid-cols-3 gap-4 pt-4">
                    <div>
                        <div>Статус</div>
                        <select className={selectStyle + " w-full"} value={formData?.status} onChange={handleChange} name="status">
                            <option value="toDo">треба виконати</option>
                            <option value="inProgress" className="text-blue-600">в процесі</option>
                            <option value="done" className="text-green-600">виконано</option>
                        </select>
                    </div>
                    <div>
                        <div>Складність</div>
                        <select className={selectStyle + " w-full"} value={formData?.difficulty} onChange={handleChange} name="difficulty">
                            <option value="low">низька</option>
                            <option value="mid" className="text-blue-600">середня</option>
                            <option value="hight" className="text-green-600">висока</option>
                        </select>
                    </div>
                    <div>
                        <div>Пріоритет</div>
                            <select className={selectStyle + " w-full"} value={formData?.priority} onChange={handleChange} name="priority">
                                <option value="low">низький</option>
                                <option value="mid" className="text-blue-600">середній</option>
                                <option value="hight" className="text-green-600">високий</option>
                            </select>
                    </div>
                </div>
                {formData?.checkedDate && <div className="flex p-3">
                    <div>Виконано:</div>
                    <div><DateFormater value={formData.checkedDate} dayOfWeek/></div>
                </div>}
                {formData && formData.executors.length > 0 && <div className="flex flex-col gap-2">
                    <div>призначено:</div>
                    <div className="flex gap-2 flex-wrap ml-4">{formData.executors.map((executor: UserResponse) => <div className="bg-gray-100 rounded px-4 py-1">{executor.nickname}</div>)}</div>
                </div>}
                <div className="flex justify-center pt-2">
                    <button type="button" className={lightButtonStyle} onClick={handleAddParticipant}>призначити користувачам</button>
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