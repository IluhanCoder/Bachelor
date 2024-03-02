import { observer } from "mobx-react-lite";
import userStore from "./user-store";
import InvitesToUserMapper from "../invite/invitesToUser-mapper";
import { useEffect, useState } from "react";
import User, { UserResponse } from "./user-types";
import userService from "./user-service";

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

    useEffect(() => {
        getUserData();
        if(userId === userStore.user?._id) setIsCurrentProfile(true);
    }, [])

    return <div>
        <div>{userData?.name}</div>
        {isCurrentProfile && <InvitesToUserMapper/>}
    </div>
}

export default observer(ProfilePage);