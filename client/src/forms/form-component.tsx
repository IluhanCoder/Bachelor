import { ReactNode } from "react";
import formStyle, {formContainerStyle, formSubContainerStyle} from "../styles/form-styles";
import formStore from "./form-store";
import { lightButtonStyle } from "../styles/button-syles";

interface LocalParams {
    formLabel: string,
    children: ReactNode
}

export default function FormComponent({formLabel,children}: LocalParams) {
    const handleSideClick = (event: React.MouseEvent) => {
        if (event.target === event.currentTarget) {
            formStore.dropForm();
        }
    }

    return <div className={formContainerStyle} onClick={(event) => handleSideClick(event)}>
        <div className={formSubContainerStyle}>
            <div className={formStyle + " relative"}>
                <button className={lightButtonStyle + " absolute right-6 top-6"} onClick={() => formStore.dropForm()}>назад</button>
                <h1 className="text-xl">{formLabel}</h1>
                <div>
                    {children}
                </div>
            </div>
        </div>
    </div>
}