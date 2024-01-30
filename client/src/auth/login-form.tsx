import FormComponent from "../forms/form-component";
import { submitButtonStyle } from "../styles/button-syles";
import { inputStyle, linkStyle } from "../styles/form-styles";
import { Link } from "react-router-dom";

export default function LoginForm () {
    return <FormComponent formLabel="Вхід в обліковий запис">
        <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2 py-2">
                <div className="flex flex-col gap-2 px-10">
                    <label className="font-bold text-gray-600 text-xs">Email або логін</label>
                    <input className={inputStyle} type="text"/>
                </div>
                <div className="flex flex-col gap-2 px-10">
                    <label className="font-bold text-gray-600 text-xs">Пароль</label>
                    <input className={inputStyle} type="password"/>
                </div>
            </div>
            <div className="flex w-full mt-4 justify-between gap-10">
                <div className="text-xs text-gray-700 mt-2">
                    <p>Якщо у вас нема облікового запису, ви можете <Link to="/registration" className={linkStyle}>зареєструватися</Link></p>
                </div>
                <div>
                    <button type="button" className={submitButtonStyle}>Увійти</button>
                </div>
            </div>
        </div>
    </FormComponent>
}