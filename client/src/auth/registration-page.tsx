import { FormEvent, useState } from "react";
import { submitButtonStyle } from "../styles/button-syles";
import { inputStyle } from "../styles/form-styles";
import RegCredantials from "./auth-types";
import { ChangeEvent } from "react";
import authService from "./auth-service";
import ErrorContainer from "../errors/error-container";
import { observer } from "mobx-react";
import errorStore from "../errors/error-store";
import { useNavigate } from "react-router-dom";

function RegistationPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<RegCredantials>({
        name: "",
        surname: "",
        nickname: "",
        email: "",
        organisation: "",
        password: "",
        pswSubmit: ""
    });

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormData({
          ...formData,
          [event.target.name]: event.target.value,
        });
    };    

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        errorStore.dropErrors();

        if(formData.password !== formData.pswSubmit) {
            errorStore.pushError("Пароль та підтвердження паролю мають співпадати");
            return;
        }

        try {
            const result = await authService.registrate(formData);

            if(result?.status === "success") { 
                alert("Користувача було успішно зареєстровано");
                await authService.login(formData);
                navigate("/");
            }
        } catch (error) {
            throw error;
        }
    }

    return <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl">
            <div className="bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Створення облікового запису</h1>
                    <p className="text-gray-600">Заповніть форму для реєстрації в системі</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Основна інформація */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                            Особиста інформація
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                                    type="text" 
                                    name="name" 
                                    onChange={handleChange}
                                    placeholder="Введіть ваше ім'я..."
                                    required
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Surname <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                                    type="text" 
                                    onChange={handleChange} 
                                    name="surname"
                                    placeholder="Введіть ваше прізвище..."
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Організація
                            </label>
                            <input 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                                type="text" 
                                onChange={handleChange} 
                                name="organisation"
                                placeholder="Назва організації (необов'язково)..."
                            />
                        </div>
                    </div>

                    {/* Облікові дані */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                            Облікові дані
                        </h2>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Логін користувача <span className="text-red-500">*</span>
                            </label>
                            <input 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                                type="text" 
                                onChange={handleChange} 
                                name="nickname"
                                placeholder="Оберіть унікальний логін..."
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Електронна пошта <span className="text-red-500">*</span>
                            </label>
                            <input 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                                type="email" 
                                onChange={handleChange} 
                                name="email"
                                placeholder="example@email.com"
                                required
                            />
                        </div>
                    </div>

                    {/* Пароль */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                            Безпека
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                                    type="password" 
                                    onChange={handleChange} 
                                    name="password"
                                    placeholder="Мінімум 6 символів..."
                                    required
                                    minLength={6}
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Підтвердження паролю <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                                    type="password" 
                                    onChange={handleChange} 
                                    name="pswSubmit"
                                    placeholder="Повторіть пароль..."
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <ErrorContainer/>

                    {/* Кнопки дій */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                        <button 
                            type="button"
                            onClick={() => navigate("/login")}
                            className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                        >
                            Вже є обліковий запис
                        </button>
                        <button 
                            type="submit" 
                            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                            Sign Up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
}

export default observer(RegistationPage);