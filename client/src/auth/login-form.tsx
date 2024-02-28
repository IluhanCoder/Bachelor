import { observer } from "mobx-react";
import FormComponent from "../forms/form-component";
import { submitButtonStyle } from "../styles/button-syles";
import { inputStyle, linkStyle } from "../styles/form-styles";
import { Link } from "react-router-dom";
import ErrorContainer from "../errors/error-container";
import authService from "./auth-service";
import { FormEvent, useState } from "react";
import { LoginCredentials } from "./auth-types";
import { ChangeEvent } from "react";
import errorStore from "../errors/error-store";
import formStore from "../forms/form-store";

function LoginForm () {
    const [formData, setFormData] = useState<LoginCredentials>({
        nickname: "",
        email: "",
        password: ""
    });

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if(event.target.name === "nickname" && event.target.value.includes("@")) {
            setFormData({
                ...formData,
                ["email"]: event.target.value,
                ["nickname"]: ""
              });
        } else 
            setFormData({
            ...formData,
            [event.target.name]: event.target.value,
            });
    };   

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        errorStore.dropErrors();

        if((formData.nickname?.length === 0 && formData.email?.length === 0) || formData.password?.length === 0) {
            errorStore.pushError("Всі поля мають бути заповнені");
            return;
        }

        const result = await authService.login(formData);

        if(result?.status === "success") { 
            formStore.dropForm();
        }
    }

    return <FormComponent formLabel="Вхід в обліковий запис">
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2 py-2">
                <div className="flex flex-col gap-2 px-10">
                    <label className="font-bold text-gray-600 text-xs">Email або логін</label>
                    <input className={inputStyle} type="text" onChange={handleChange} name="nickname"/>
                </div>
                <div className="flex flex-col gap-2 px-10">
                    <label className="font-bold text-gray-600 text-xs">Пароль</label>
                    <input className={inputStyle} type="password" onChange={handleChange} name="password"/>
                </div>
            </div>
            <div className="flex justify-center">
                <ErrorContainer/>
            </div>
            <div className="flex w-full mt-4 justify-between gap-10">
                <div className="text-xs text-gray-700 mt-2">
                    <p>Якщо у вас нема облікового запису, ви можете <Link to="/registration" className={linkStyle}>зареєструватися</Link></p>
                </div>
                <div>
                    <button type="submit" className={submitButtonStyle}>Увійти</button>
                </div>
            </div>
        </form>
    </FormComponent>
}

export default observer(LoginForm);