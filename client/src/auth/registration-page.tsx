import { submitButtonStyle } from "../styles/button-syles";
import { inputStyle } from "../styles/form-styles";

export default function RegistationPage() {
    return <div className="flex flex-col p-4">
        <div className="flex justify-center">
            <div className="flex justify-center px-12 w-2/3">
                <div className="flex flex-col w-full">
                    <div className="flex justify-center">
                        <h1 className="text-2xl">Реєстрація</h1>
                    </div>
                    <form className="grid grid-cols-2 p-4 gap-x-10 gap-y-4">
                        <div className="flex flex-col gap-1">
                            <label className="font-bold text-gray-600 text-xs">Ім'я</label>
                            <input className={inputStyle} type="text"/>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="font-bold text-gray-600 text-xs">Прізвище</label>
                            <input className={inputStyle} type="text"/>
                        </div>
                        <div className="flex flex-col gap-1 col-span-2">
                            <label className="font-bold text-gray-600 text-xs">Електрона поштa</label>
                            <input className={inputStyle} type="email"/>
                        </div>
                        <div className="flex flex-col gap-1 col-span-2">
                            <label className="font-bold text-gray-600 text-xs">Назва організації</label>
                            <input className={inputStyle} type="text"/>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="font-bold text-gray-600 text-xs">Пароль</label>
                            <input className={inputStyle} type="password"/>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="font-bold text-gray-600 text-xs">Підтвердження паролю</label>
                            <input className={inputStyle} type="password"/>
                        </div>
                    </form>
                    <div className="flex justify-center pt-4">
                        <button type="button" className={submitButtonStyle}>Зареєструватися</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
}