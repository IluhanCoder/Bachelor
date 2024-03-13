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
        <form className="flex gap-4 flex-col" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2 py-2">
            <div className="flex flex-col gap-2 px-10">
                <label className="font-bold text-gray-600 text-xs">нікнейм:</label>
                <input defaultValue={formData.nickname} type="text" className={inputStyle} onChange={handleChange} name="nickname"/>
            </div>
            <div className="flex flex-col gap-2 px-10">
                <label className="font-bold text-gray-600 text-xs">ім'я:</label>
                <input defaultValue={formData.name} type="text" className={inputStyle} onChange={handleChange} name="name"/>
            </div>
            <div className="flex flex-col gap-2 px-10">
                <label className="font-bold text-gray-600 text-xs">прізвище:</label>
                <input defaultValue={formData.surname} type="text" className={inputStyle} onChange={handleChange} name="surname"/>
            </div>
            <div className="flex flex-col gap-2 px-10">
                <label className="font-bold text-gray-600 text-xs">організація:</label>
                <input defaultValue={formData.organisation} type="text" className={inputStyle} onChange={handleChange} name="organisation"/>
            </div>
            </div>
            <button type="submit" className={submitButtonStyle}>підтвердити зміни</button>
        </form>
    </FormComponent>
}

export default EditProfileForm;