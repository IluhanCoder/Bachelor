import { observer } from "mobx-react-lite";
import userStore from "./user-store";
import InvitesToUserMapper from "../invite/invitesToUser-mapper";
import { useEffect, useState } from "react";
import User, { UserResponse } from "./user-types";
import userService from "./user-service";
import { submitButtonStyle } from "../styles/button-syles";
import formStore from "../forms/form-store";
import EditProfileForm from "./edit-profile-form";

interface LocalParams {
    userId: string
}

function ProfilePage ({userId}: LocalParams) {
    const [isCurrentProfile, setIsCurrentProfile] = useState<boolean>(false);
    const [userData, setUserData] = useState<User | null>();

    const getUserData = async () => {
        const result = await userService.getUserById(userId);
        setUserData(result.user);
    }

    const handleEditProfile = async () => {
        if(userData) formStore.setForm(<EditProfileForm userData={userData} callback={getUserData}/>)
    }

    useEffect(() => {
        getUserData();
        if(userId === userStore.user?._id) setIsCurrentProfile(true);
    }, [])

    return <div>
        <div>{userData?.nickname}</div>
        <div>{userData?.name}</div>
        <div>{userData?.surname}</div>
        <div>{userData?.organisation}</div>
        {isCurrentProfile && <InvitesToUserMapper/>}
        {isCurrentProfile && <button type="button" className={submitButtonStyle} onClick={handleEditProfile}>редагувати профіль</button>}
    </div>
}

export default observer(ProfilePage);