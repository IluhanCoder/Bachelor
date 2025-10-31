import { ChangeEvent, FormEvent, FormEventHandler, useState } from "react";
import FormComponent from "../forms/form-component";
import { submitButtonStyle } from "../styles/button-syles";
import formStore from "../forms/form-store";
import sprintService from "./sprint-service";
import { inputStyle } from "../styles/form-styles";
import DatePicker from "../analytics/date-picker";

interface LocalParams {
    backlogId: string,
    callBack?: () => void
}

function NewSprintForm ({callBack, backlogId}: LocalParams) {
    // Default: start today, end in 2 weeks
    const today = new Date();
    const twoWeeksLater = new Date();
    twoWeeksLater.setDate(today.getDate() + 14);

    const [formData, setFormData] = useState<{
        name: string,
        goal: string,
        startDate: Date,
        endDate: Date
    }>({
        name: "",
        goal: "",
        startDate: today,
        endDate: twoWeeksLater
    });

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        await sprintService.createSprint(backlogId, formData.name, formData.goal, formData.startDate, formData.endDate);
        formStore.dropForm();
        if(callBack) callBack();
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormData({
        ...formData,
        [event.target.name]: event.target.value,
        });
    };

    const handleStart = (date: Date) => {
        if(date >= formData.endDate) return;
        setFormData({
            ...formData,
            startDate: date
        });
    }

    const handleEnd = (date: Date) => {
        if(date <= formData.startDate) return;
        setFormData({
            ...formData,
            endDate: date
        });
    }  

    return <FormComponent formLabel="Create Sprint">
        <form onSubmit={(event: FormEvent) => handleSubmit(event)} className="space-y-6">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Sprint Name <span className="text-red-500">*</span>
                </label>
                <input 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                    type="text" 
                    name="name" 
                    onChange={handleChange}
                    placeholder="Enter sprint name..."
                    required
                />
            </div>
            
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Sprint Goal
                </label>
                <input 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                    type="text" 
                    name="goal" 
                    onChange={handleChange}
                    placeholder="Describe sprint goal..."
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Timeframe
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

export default NewSprintForm;