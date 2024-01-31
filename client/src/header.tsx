import { Link, useLinkClickHandler, useLocation } from "react-router-dom";
import formStore from "./forms/form-store";
import LoginForm from "./auth/login-form";
import { observer } from "mobx-react";
import userStore from "./user/user-store";
import authService from "./auth/auth-service";

function Header() {
    const handleLoginButtonClick = () => {
        formStore.setForm(<LoginForm/>);
    }
    
    const {pathname} = useLocation();

    const handleLogout = async () => {
        await authService.logout();
    }

    if(pathname !== "/registration") return <div>
        <div>
            {userStore.user && 
            <div>
                <div>вітаємо, {userStore.user.nickname}</div>
                <div>
                    <button type="button" onClick={handleLogout}>вийти</button>
                </div>
            </div>
            || <button type="button" onClick={handleLoginButtonClick}>
                увійти
            </button>}
        </div>
    </div>
    else return <></>
}

export default observer(Header);