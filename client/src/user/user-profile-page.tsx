import { useParams } from "react-router-dom";
import ProfilePage from "./profile-page";

function UserProfilePage() {
    const {userId} = useParams();
    if(userId) return <ProfilePage userId={userId}/>
    else return <div></div>
}

export default UserProfilePage;