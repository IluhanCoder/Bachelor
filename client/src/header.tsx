import { Link, useLinkClickHandler, useLocation } from "react-router-dom";
import formStore from "./forms/form-store";
import LoginForm from "./auth/login-form";

export default function Header() {
    const handleLoginButtonClick = () => {
        formStore.setForm(<LoginForm/>);
    }
    
    const {pathname} = useLocation();

    if(pathname !== "/registration") return <div>
        <div>
            <button type="button" onClick={handleLoginButtonClick}>
                увійти
            </button>
        </div>
    </div>
    else return <></>
}