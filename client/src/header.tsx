import { Link, useLinkClickHandler, useLocation, useNavigate } from "react-router-dom";
import formStore from "./forms/form-store";
import LoginForm from "./auth/login-form";
import { observer } from "mobx-react";
import userStore from "./user/user-store";
import authService from "./auth/auth-service";
import { VscRemote } from "react-icons/vsc";
import { lightButtonStyle, smallLightButtonStyle } from "./styles/button-syles";
import Avatar from "react-avatar";
import { Buffer } from "buffer";

function Header() {
    const navigate = useNavigate();

    const handleLoginButtonClick = () => {
        formStore.setForm(<LoginForm/>);
    }
    
    const {pathname} = useLocation();

    const handleLogout = async () => {
        await authService.logout();
        navigate("/");
    }

    const convertImage = (image: any) => {
        const base64String = `data:image/jpeg;base64,${Buffer.from(image.data).toString('base64')}`;
        return base64String;
    };

    if(pathname !== "/registration") return <div className="flex justify-between gap-2 border border-gray-300 px-8 py-2">
        <div className="flex gap-14">
            <div className="text-2xl flex gap-1">
                <VscRemote className="mt-1"/>
                Log Manager
            </div>
            <div className="mt-1 flex text-gray-600 gap-3">
                <Link to="/projects">Проекти</Link>
                <Link to="/profile">Профіль</Link>
            </div>
        </div>
        <div className="text-gray-600">
            {userStore.user && 
            <div className="flex gap-4">
                <Link to="/profile" className="flex gap-2">
                    <Avatar src={userStore.user.avatar ? convertImage(userStore.user.avatar.data) : ""} name={userStore.user.nickname} round size="30"/>
                    <div className="mt-1">{userStore.user.nickname}</div>
                </Link>
                <div className="pt-1">
                    <button className={smallLightButtonStyle} type="button" onClick={handleLogout}>вийти</button>
                </div>
            </div>
            || <div className="pt-1"><button className={smallLightButtonStyle} type="button" onClick={handleLoginButtonClick}>
                увійти
            </button></div>}
        </div>
    </div>
    else return <></>
}

export default observer(Header);