import { ChangeEvent, FormEvent, FormEventHandler, useEffect, useState } from "react";
import FormComponent from "../forms/form-component";
import Sprint, { SprintPutRequest, SprintResponse } from "./sprint-types";
import sprintService from "./sprint-service";
import DatePicker from "../analytics/date-picker";
import { submitButtonStyle } from "../styles/button-syles";
import formStore from "../forms/form-store";
import { inputStyle } from "../styles/form-styles";
import LoadingScreen from "../misc/loading-screen";

interface LocalParams {
    sprintId: string,
    callBack?: () => void
}

function EditSprintForm({sprintId, callBack}: LocalParams) {
    const [sprintData, setSprintData] = useState<Sprint>();
    const [formData, setFormData] = useState<{
        name: string,
        goal: string,
        startDate: Date,
        endDate: Date
    } | undefined>(undefined)

    const getSprintData = async () => {
        if(sprintId) {
            const result = await sprintService.getSprintById(sprintId); 
            console.log(result);
            setSprintData({...result.sprint});
        }
    }

    useEffect(() => {
        getSprintData();
    }, [])

    useEffect(() => {
        const today = new Date();
        const twoWeeksLater = new Date();
        twoWeeksLater.setDate(today.getDate() + 14);

        const updatedData: SprintPutRequest = {
            name: sprintData?.name ?? "",
            goal: sprintData?.goal ?? "",
            startDate: sprintData?.startDate ?? today,
            endDate: sprintData?.endDate ?? twoWeeksLater
        };
        setFormData({...updatedData});
    }, [sprintData])

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if(formData)
            setFormData({
            ...formData,
            [event.target.name]: event.target.value,
            });
    };   

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if(formData) {
            await sprintService.editSprint(sprintId, formData);
            formStore.dropForm();
            if(callBack) callBack();
        }
    }

    const handleStart = (date: Date) => {
        if(formData) {
            if(date >= formData.endDate) return;
            const newData: SprintPutRequest = {
                name: formData?.name,
                goal: formData?.goal,
                startDate: date,
                endDate: formData.endDate
            };
            setFormData({...newData});
        }
    }

    const handleEnd = (date: Date) => {
        if(formData) {
            if(date <= formData.startDate) return;
            const newData: SprintPutRequest = {
                name: formData?.name,
                goal: formData?.goal,
                startDate: formData.startDate,
                endDate: date
            };
            setFormData({...newData});
        }
    }

    return <FormComponent formLabel="спрінт">
        {formData?.name && <form className="space-y-6" onSubmit={(event: FormEvent) => {handleSubmit(event)}}>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Назва <span className="text-red-500">*</span>
                </label>
                <input 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                    type="text" 
                    name="name" 
                    defaultValue={formData.name} 
                    onChange={handleChange}
                    placeholder="Назва спрінту..."
                />
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Мета
                </label>
                <input 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                    type="text" 
                    name="goal" 
                    defaultValue={formData.goal} 
                    onChange={handleChange}
                    placeholder="Опишіть мету спрінту..."
                />
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Терміни виконання
                </label>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                    <DatePicker 
                        className="flex flex-col gap-4" 
                        handleStart={handleStart} 
                        handleEnd={handleEnd} 
                        startDate={formData.startDate} 
                        endDate={formData.endDate}
                    />
                </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <button 
                    type="button"
                    onClick={() => formStore.dropForm()}
                    className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                    Скасувати
                </button>
                <button 
                    type="submit" 
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Внести зміни
                </button>
            </div>
        </form> || <div className="w-96"><LoadingScreen/></div>}
    </FormComponent>
}

export default EditSprintForm;