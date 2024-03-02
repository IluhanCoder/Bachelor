import { observer } from "mobx-react";
import ProfilePage from "./profile-page";
import userStore from "./user-store";

function MyProfilePage() {
    if(userStore.user) return <ProfilePage userId={userStore.user?._id}/>
    else return <div></div>
}

export default observer(MyProfilePage);