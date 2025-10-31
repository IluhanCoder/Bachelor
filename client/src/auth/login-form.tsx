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

        const loginData = {
            nickname: formData.nickname || "",
            email: formData.email || "",
            password: formData.password || ""
        };

        const result = await authService.login(loginData);

        if(result?.status === "success") { 
            formStore.dropForm();
        }
    }

    return <FormComponent formLabel="Вхід в обліковий запис">
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Email або логін <span className="text-red-500">*</span>
                    </label>
                    <input 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                        type="text" 
                        onChange={handleChange} 
                        name="nickname"
                        placeholder="Введіть email або логін..."
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Password <span className="text-red-500">*</span>
                    </label>
                    <input 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                        type="password" 
                        onChange={handleChange} 
                        name="password"
                        placeholder="Введіть пароль..."
                        required
                    />
                </div>
            </div>

            <ErrorContainer/>

            <div className="flex items-center justify-between gap-4 pt-4">
                <div className="text-sm text-gray-600">
                    Якщо у вас нема облікового запису, ви можете{' '}
                    <Link to="/registration" className="text-blue-600 hover:text-blue-700 font-medium underline">
                        зареєструватися
                    </Link>
                </div>
                <button 
                    type="submit" 
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Sign In
                </button>
            </div>
        </form>
    </FormComponent>
}

export default observer(LoginForm);