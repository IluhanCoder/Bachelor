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

    if(pathname !== "/registration") return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-2.5">
                <div className="flex justify-between items-center">
                    {/* Logo & Navigation */}
                    <div className="flex items-center gap-8">
                        {/* Logo */}
                        <Link to="/projects" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-200 transition-transform group-hover:scale-105">
                                <VscRemote className="text-white text-base"/>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Log Manager
                            </span>
                        </Link>

                        {/* Navigation Links - Only show when logged in */}
                        {userStore.user && (
                            <nav className="flex items-center gap-1">
                                <Link 
                                    to="/projects" 
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                        pathname.startsWith('/project') 
                                            ? 'bg-blue-50 text-blue-700' 
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                                >
                                    Projects
                                </Link>
                                <Link 
                                    to="/profile" 
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                        pathname === '/profile' 
                                            ? 'bg-blue-50 text-blue-700' 
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                                >
                                    Profile
                                </Link>
                            </nav>
                        )}
                    </div>

                    {/* User Menu */}
                    <div className="flex items-center gap-2">
                        {userStore.user ? (
                            <>
                                <Link 
                                    to="/profile" 
                                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-all group"
                                >
                                    <div className="relative">
                                        <Avatar 
                                            src={userStore.user.avatar ? convertImage(userStore.user.avatar.data) : ""} 
                                            name={userStore.user.nickname} 
                                            round 
                                            size="32"
                                            className="ring-2 ring-slate-200 group-hover:ring-blue-300 transition-all"
                                        />
                                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                                    </div>
                                    <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700 transition-colors">
                                        {userStore.user.nickname}
                                    </span>
                                </Link>
                                <button 
                                    className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-700 transition-all flex items-center gap-1.5"
                                    type="button" 
                                    onClick={handleLogout}
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <button 
                                className="px-5 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300 transition-all"
                                type="button" 
                                onClick={handleLoginButtonClick}
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
    else return <></>
}

export default observer(Header);