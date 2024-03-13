import { VscRocket, VscOrganization, VscArrowSwap, VscSymbolEvent, VscGraphLine  } from "react-icons/vsc";
import userStore from "../user/user-store";
import { Link } from "react-router-dom";
import { lightButtonStyle } from "../styles/button-syles";
import { observer } from "mobx-react";

function WelcomePage() {
    return <div className="flex w-full pt-20">
        <div className="flex justify-center w-full">
            <div className="flex flex-col gap-6">
                <h1 className="text-3xl text-gray-800 font-light">Вітаємо у Log Manager!</h1>
                    <div className="flex flex-col gap-4 text-xl px-10 font-light">
                        <div className="flex gap-4">
                            <VscRocket className="mt-1"/>
                            <p>створюйте проекти</p>
                        </div>
                        <div className="flex gap-4">
                            <VscOrganization className="mt-1"/>
                            <p>збирайте команди</p>
                        </div>
                        <div className="flex gap-4">
                            <VscArrowSwap className="mt-1"/>
                            <p>керуйте процесом</p>
                        </div>
                        <div className="flex gap-4">
                            <VscSymbolEvent className="mt-1"/>
                            <p>організовуйте спрінти</p>
                        </div>
                        <div className="flex gap-4">
                            <VscGraphLine className="mt-1"/>
                            <p>аналізуйте продуктивність</p>
                        </div>
                    </div>
                    {userStore.user && 
                    <div className="flex justify-center">
                        <Link to="/projects" className={lightButtonStyle}>ваші проекти</Link>
                    </div>}
                </div>
        </div>
    </div>
}

export default observer(WelcomePage);