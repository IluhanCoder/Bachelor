import { observer } from "mobx-react-lite";
import userStore from "./user-store";
import InvitesToUserMapper from "../invite/invitesToUser-mapper";
import { useEffect, useState } from "react";
import User, { UserResponse } from "./user-types";
import userService from "./user-service";
import { lightButtonStyle, smallLightButtonStyle, submitButtonStyle } from "../styles/button-syles";
import formStore from "../forms/form-store";
import EditProfileForm from "./edit-profile-form";
import { Buffer } from "buffer";
import Avatar from "react-avatar";

interface LocalParams {
    userId: string
}

function ProfilePage ({userId}: LocalParams) {
    const [isCurrentProfile, setIsCurrentProfile] = useState<boolean>(false);
    const [userData, setUserData] = useState<User | null>();

    const getUserData = async () => {
        const result = await userService.getUserById(userId);
        setUserData({...result.user});
    }

    const handleEditProfile = async () => {
        if(userData) formStore.setForm(<EditProfileForm userData={userData} callback={getUserData}/>)
    }
    
    const handleNewAvatar = async (files: FileList | null) => {
        if(files) {
            await userService.setAvatar(files[0]);
            getUserData();
        }
    }

    const convertImage = (image: any) => {
        console.log(image.data)
        const base64String = `data:image/jpeg;base64,${Buffer.from(image.data.data).toString('base64')}`;
        return base64String;
    };

    useEffect(() => {
        getUserData();
        if(userId === userStore.user?._id) setIsCurrentProfile(true);
    }, [])

    return <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`grid ${isCurrentProfile ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'} gap-8`}>
                {/* Profile Card */}
                <div className={`${isCurrentProfile ? 'lg:col-span-1' : 'max-w-md mx-auto w-full'}`}>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative">
                                <Avatar 
                                    name={userData?.nickname} 
                                    src={userData?.avatar ? convertImage(userData?.avatar) : ""} 
                                    size="120"
                                    round
                                />
                                {isCurrentProfile && (
                                    <label 
                                        htmlFor="files" 
                                        className="absolute bottom-0 right-0 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full cursor-pointer transition-colors shadow-lg"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </label>
                                )}
                                <input 
                                    type="file" 
                                    id="files" 
                                    className="hidden" 
                                    onChange={(e) => handleNewAvatar(e.target.files)}
                                    accept="image/*"
                                />
                            </div>
                            <div className="text-center">
                                <h1 className="text-2xl font-bold text-gray-900">{userData?.nickname}</h1>
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            {userData?.name && (
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs text-gray-500 uppercase tracking-wide">Ім'я</div>
                                        <div className="text-gray-900 font-medium">{userData.name} {userData.surname}</div>
                                    </div>
                                </div>
                            )}
                            {userData?.organisation && (
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs text-gray-500 uppercase tracking-wide">Організація</div>
                                        <div className="text-gray-900 font-medium">{userData.organisation}</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Edit Button */}
                        {isCurrentProfile && (
                            <button 
                                type="button" 
                                className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                onClick={handleEditProfile}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Редагувати профіль
                            </button>
                        )}
                    </div>
                </div>

                {/* Invites Section */}
                {isCurrentProfile && (
                    <div className="lg:col-span-2">
                        <InvitesToUserMapper/>
                    </div>
                )}
            </div>
        </div>
    </div>
}

export default observer(ProfilePage);