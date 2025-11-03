import { FormEvent, useState } from "react";
import { submitButtonStyle } from "../styles/button-syles";
import { inputStyle } from "../styles/form-styles";
import RegCredantials from "./auth-types";
import { ChangeEvent } from "react";
import authService from "./auth-service";
import ErrorContainer from "../errors/error-container";
import { observer } from "mobx-react";
import errorStore from "../errors/error-store";
import toastStore from "../misc/toast-store";
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

        // Validation
        if (!formData.name?.trim()) {
            errorStore.pushError("Name is required");
            toastStore.error("Name is required");
            return;
        }

        if (!formData.surname?.trim()) {
            errorStore.pushError("Surname is required");
            toastStore.error("Surname is required");
            return;
        }

        if (!formData.nickname?.trim()) {
            errorStore.pushError("Username is required");
            toastStore.error("Username is required");
            return;
        }

        if (!formData.email?.trim()) {
            errorStore.pushError("Email is required");
            toastStore.error("Email is required");
            return;
        }

        if (!formData.password) {
            errorStore.pushError("Password is required");
            toastStore.error("Password is required");
            return;
        }

        if (formData.password.length < 6) {
            errorStore.pushError("Password must be at least 6 characters");
            toastStore.error("Password must be at least 6 characters");
            return;
        }

        if(formData.password !== formData.pswSubmit) {
            errorStore.pushError("Passwords do not match");
            toastStore.error("Passwords do not match");
            return;
        }

        try {
            const result = await authService.registrate(formData);

            if(result?.status === "success") { 
                toastStore.success("Account created successfully! Logging in...");
                await authService.login(formData);
                navigate("/");
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || "Registration failed. Please try again.";
            errorStore.pushError(errorMessage);
            toastStore.error(errorMessage);
        }
    }

    return <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl">
            <div className="bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                    <p className="text-gray-600">Fill in the form to register in the system</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                            Personal Information
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
                                    placeholder="Enter your name..."
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
                                    placeholder="Enter your surname..."
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Organization
                            </label>
                            <input 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                                type="text" 
                                onChange={handleChange} 
                                name="organisation"
                                placeholder="Organization name (optional)..."
                            />
                        </div>
                    </div>

                    {/* Account Credentials */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                            Account Credentials
                        </h2>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Username <span className="text-red-500">*</span>
                            </label>
                            <input 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                                type="text" 
                                onChange={handleChange} 
                                name="nickname"
                                placeholder="Choose a unique username..."
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Email <span className="text-red-500">*</span>
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

                    {/* Security */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                            Security
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
                                    placeholder="Minimum 6 characters..."
                                    required
                                    minLength={6}
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Confirm Password <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                                    type="password" 
                                    onChange={handleChange} 
                                    name="pswSubmit"
                                    placeholder="Repeat password..."
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <ErrorContainer/>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                        <button 
                            type="button"
                            onClick={() => navigate("/login")}
                            className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                        >
                            Already have an account
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