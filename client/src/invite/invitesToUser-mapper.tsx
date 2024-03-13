import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { InviteToUserResponse } from "./invite-types";
import inviteService from "./invite-service";
import userStore from "../user/user-store";
import { submitButtonStyle } from "../styles/button-syles";
import { Link } from "react-router-dom";
import { linkStyle } from "../styles/form-styles";

function InvitesToUserMapper () {
    const [invites, setInvites] = useState<InviteToUserResponse[]>([]);

    const getInvites = async () => {
        if(userStore.user) {
            const result = await inviteService.getInvitesToUser();
            setInvites([...result.invites]);
        }
    }

    const handleAcceptInvite = async (inviteId: string, accept: boolean) => {
        await inviteService.seeInvite(inviteId, accept);
        await getInvites();
    }

    useEffect(() => {
        getInvites();
    }, [])

    return <div className="flex flex-col gap-3">
        <div className="flex justify-center text-xl">Запрошення:</div>
            {invites.length > 0 && 
                <div className="grid grid-cols-2 gap-4">{invites.map((invite: InviteToUserResponse) => {
                    return <div className="bg-gray-100 rounded border-1 border p-4">
                        <div className="text-xl pb-2">
                            {invite.project.name}
                        </div>
                        <div className="flex gap-1">
                            Запрошує користувач
                            <Link className={linkStyle} to={`/profile/${invite.host._id}`}>{invite.host.name}</Link>
                        </div>
                        <div className="flex gap-2 p-4">
                            <button type="button" className={submitButtonStyle} onClick={() => handleAcceptInvite(invite._id, true)}>
                                прийняти запрошення
                            </button>
                            <button type="button" className={submitButtonStyle} onClick={() => handleAcceptInvite(invite._id, false)}>
                                відхилити запрошення
                            </button>
                        </div>
                    </div>
            })}</div> 
        || <div className="flex text-center text-gray-500 font-bold">
            запрошення відсутні
        </div>}
    </div>
}

export default observer(InvitesToUserMapper);