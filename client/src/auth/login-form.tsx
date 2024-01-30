import FormComponent from "../forms/form-component";

export default function LoginForm () {
    return <FormComponent formLabel="Вхід в обліковий запис">
        <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-700 text-xs">Email або логін</label>
                <input className="border-2 border-gray-300 w-64 rounded px-1" type="text"/>
            </div>
            <div className="flex flex-col">
                <label className="font-bold text-gray-700 text-xs">Пароль</label>
                <input className="border-2 border-gray-300 rounded px-1" type="password"/>
            </div>
        </div>
    </FormComponent>
}