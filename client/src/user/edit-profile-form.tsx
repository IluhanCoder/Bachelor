import { ChangeEvent, FormEvent, useState } from "react";
import User, { UserResponse } from "./user-types";
import FormComponent from "../forms/form-component";
import { inputStyle } from "../styles/form-styles";
import { submitButtonStyle } from "../styles/button-syles";
import userService from "./user-service";
import formStore from "../forms/form-store";

interface LocalParams {
    userData: User,
    callback?: () => {}
}

function EditProfileForm ({userData, callback}: LocalParams) {
    const [formData, setFormData] = useState<User>(userData);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    }; 

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        await userService.updateUser(userData._id, formData);
        if(callback) callback();
        formStore.dropForm();
    }

    return <FormComponent formLabel="Редагування профіля">
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Нікнейм
                    </label>
                    <input 
                        defaultValue={formData.nickname} 
                        type="text" 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                        onChange={handleChange} 
                        name="nickname"
                        placeholder="Ваш нікнейм..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Name
                    </label>
                    <input 
                        defaultValue={formData.name} 
                        type="text" 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                        onChange={handleChange} 
                        name="name"
                        placeholder="Ваше ім'я..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Surname
                    </label>
                    <input 
                        defaultValue={formData.surname} 
                        type="text" 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                        onChange={handleChange} 
                        name="surname"
                        placeholder="Ваше прізвище..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Організація
                    </label>
                    <input 
                        defaultValue={formData.organisation} 
                        type="text" 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                        onChange={handleChange} 
                        name="organisation"
                        placeholder="Назва організації..."
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
                    Підтвердити зміни
                </button>
            </div>
        </form>
    </FormComponent>
}

export default EditProfileForm;