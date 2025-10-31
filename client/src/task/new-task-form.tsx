import { ChangeEvent, FormEvent, useState } from "react";
import FormComponent from "../forms/form-component";
import { submitButtonStyle } from "../styles/button-syles";
import { TaskCredentials } from "./task-types";
import userStore from "../user/user-store";
import taskService from "./task-service";
import formStore from "../forms/form-store";
import { inputStyle } from "../styles/form-styles";

interface LocalParams {
    backlogId: string,
    callBack?: () => void
}

function NewTaskForm({backlogId, callBack}: LocalParams) {
    const [formData, setFormData] = useState<TaskCredentials>({
        name: "",
        desc: "",
        requirements: "",
        createdBy: userStore.user?._id ?? "",
        priority: "mid",
        difficulty: "mid"
    });

    const handleSubmit = async(event: FormEvent) => {
        event.preventDefault();
        await taskService.newTask(backlogId, formData.createdBy, formData.name, formData.desc, formData.requirements, formData.priority || "mid", formData.difficulty || "mid");
        if(callBack) callBack();
        formStore.dropForm();
    }

    const handleChange = (event: any) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    }; 



    return <FormComponent formLabel="Створити нову задачу">
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Task Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Назва задачі
                    <span className="text-red-500 ml-1">*</span>
                </label>
                <input 
                    type="text" 
                    name="name"
                    required
                    placeholder="Введіть назву задачі..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                    onChange={handleChange}
                    value={formData.name}
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Опис
                </label>
                <textarea 
                    name="desc"
                    rows={4}
                    placeholder="Опишіть деталі задачі..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none placeholder-gray-400"
                    onChange={handleChange}
                    value={formData.desc}
                />
            </div>

            {/* Priority and Difficulty Grid */}
            <div className="grid grid-cols-2 gap-4">
                {/* Priority */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Пріоритет
                    </label>
                    <select
                        name="priority"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                        onChange={handleChange}
                        value={formData.priority}
                    >
                        <option value="low">🟢 Низький</option>
                        <option value="mid">🟡 Середній</option>
                        <option value="high">🔴 Високий</option>
                    </select>
                </div>

                {/* Difficulty */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Складність
                    </label>
                    <select
                        name="difficulty"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                        onChange={handleChange}
                        value={formData.difficulty}
                    >
                        <option value="low">⭐ Легка</option>
                        <option value="mid">⭐⭐ Середня</option>
                        <option value="high">⭐⭐⭐ Висока</option>
                    </select>
                </div>
            </div>

            {/* Requirements */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Вимоги
                </label>
                <textarea 
                    name="requirements"
                    rows={4}
                    placeholder="Технічні вимоги або критерії виконання..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none placeholder-gray-400"
                    onChange={handleChange}
                    value={formData.requirements}
                />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button 
                    type="button"
                    onClick={() => formStore.dropForm()}
                    className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Скасувати
                </button>
                <button 
                    type="submit"
                    className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Створити задачу
                </button>
            </div>
        </form>
    </FormComponent>
}

export default NewTaskForm;