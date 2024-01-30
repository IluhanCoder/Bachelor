import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import formStore from "./form-store";

interface LocalParams {
    children: ReactNode
}

export default function FormCloserProvider({children}: LocalParams) {
    const location = useLocation()
    const form = formStore;
    
    useEffect(() => {
        form.dropForm();
    }, [location])

    return <>{children}</>
}