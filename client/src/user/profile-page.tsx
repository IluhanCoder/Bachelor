import { observer } from "mobx-react-lite";
import userStore from "./user-store";
import InvitesToUserMapper from "../invite/invitesToUser-mapper";
import { useEffect, useState } from "react";
import User, { UserResponse } from "./user-types";
import userService from "./user-service";
import { submitButtonStyle } from "../styles/button-syles";
import formStore from "../forms/form-store";
import EditProfileForm from "./edit-profile-form";
import { Buffer } from "buffer";

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

    return <div>
        <div>
            {JSON.stringify(userData)}
            <img
                className="w-48 rounded shadow-md"
                src={userData?.avatar ? convertImage(userData?.avatar) : ""}
            />
            <input type="file" onChange={(e) => handleNewAvatar(e.target.files)}/>
        </div>
        <div>{userData?.nickname}</div>
        <div>{userData?.name}</div>
        <div>{userData?.surname}</div>
        <div>{userData?.organisation}</div>
        {isCurrentProfile && <InvitesToUserMapper/>}
        {isCurrentProfile && <button type="button" className={submitButtonStyle} onClick={handleEditProfile}>редагувати профіль</button>}
    </div>
}

export default observer(ProfilePage);