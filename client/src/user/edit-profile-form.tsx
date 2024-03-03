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
        <form onSubmit={handleSubmit}>
            <div>
                <label>нікнейм:</label>
                <input defaultValue={formData.nickname} type="text" className={inputStyle} onChange={handleChange} name="nickname"/>
            </div>
            <div>
                <label>ім'я:</label>
                <input defaultValue={formData.name} type="text" className={inputStyle} onChange={handleChange} name="name"/>
            </div>
            <div>
                <label>прізвище:</label>
                <input defaultValue={formData.surname} type="text" className={inputStyle} onChange={handleChange} name="surname"/>
            </div>
            <div>
                <label>організація:</label>
                <input defaultValue={formData.organisation} type="text" className={inputStyle} onChange={handleChange} name="organisation"/>
            </div>
            <button type="submit" className={submitButtonStyle}>підтвердити зміни</button>
        </form>
    </FormComponent>
}

export default EditProfileForm;