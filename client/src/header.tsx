import { Link, useLinkClickHandler } from "react-router-dom";
import formStore from "./forms/form-store";
import LoginForm from "./auth/login-form";

export default function Header() {
    const handleLoginButtonClick = () => {
        formStore.setForm(<LoginForm/>);
    }

    return <div>
        <div>
            <button type="button" onClick={handleLoginButtonClick}>
                увійти
            </button>
        </div>
    </div>
}