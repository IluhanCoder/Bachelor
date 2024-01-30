import { FormEvent, useState } from "react";
import { submitButtonStyle } from "../styles/button-syles";
import { inputStyle } from "../styles/form-styles";
import RegCredantials from "./auth-types";
import { ChangeEvent } from "react";
import authService from "./auth-service";

export default function RegistationPage() {
    const [formData, setFormData] = useState<RegCredantials>({
        name: "",
        surname: "",
        nickname: "",
        email: "",
        organisation: "",
        password: ""
    });

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormData({
          ...formData,
          [event.target.name]: event.target.value,
        });
    };    

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        console.log(formData);
        await authService.registrate(formData);
    }

    return <div className="flex flex-col p-4">
        <div className="flex justify-center">
            <div className="flex justify-center px-12 w-2/3">
                <div className="flex flex-col w-full">
                    <div className="flex justify-center">
                        <h1 className="text-2xl">Реєстрація</h1>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 p-4 gap-x-10 gap-y-4">
                            <div className="flex flex-col gap-1">
                                <label className="font-bold text-gray-600 text-xs">Ім'я</label>
                                <input className={inputStyle} type="text" name="name" onChange={handleChange}/>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="font-bold text-gray-600 text-xs">Прізвище</label>
                                <input className={inputStyle} type="text" onChange={handleChange} name="surname"/>
                            </div>
                            <div className="flex flex-col gap-1 col-span-2">
                                <label className="font-bold text-gray-600 text-xs">Логін користувача</label>
                                <input className={inputStyle} type="text" onChange={handleChange} name="nickname"/>
                            </div>
                            <div className="flex flex-col gap-1 col-span-2">
                                <label className="font-bold text-gray-600 text-xs">Електрона поштa</label>
                                <input className={inputStyle} type="email" onChange={handleChange} name="email"/>
                            </div>
                            <div className="flex flex-col gap-1 col-span-2">
                                <label className="font-bold text-gray-600 text-xs">Назва організації</label>
                                <input className={inputStyle} type="text" onChange={handleChange} name="organisation"/>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="font-bold text-gray-600 text-xs">Пароль</label>
                                <input className={inputStyle} type="password" onChange={handleChange} name="password"/>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="font-bold text-gray-600 text-xs">Підтвердження паролю</label>
                                <input className={inputStyle} type="password" onChange={handleChange}/>
                            </div>
                        </div>
                        <div className="flex justify-center pt-4">
                            <button type="submit" className={submitButtonStyle} onClick={handleSubmit}>Зареєструватися</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
}