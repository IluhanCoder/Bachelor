import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { InviteToUserResponse } from "./invite-types";
import inviteService from "./invite-service";
import userStore from "../user/user-store";
import { submitButtonStyle } from "../styles/button-syles";

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

    return <div>
        <div>Запрошення:</div>
        {invites.map((invite: InviteToUserResponse) => {
            return <div>
                <div>
                    {invite.host.name}
                </div>
                <div>
                    {invite.project.name}
                </div>
                <div>
                    <button type="button" className={submitButtonStyle} onClick={() => handleAcceptInvite(invite._id, true)}>
                        прийняти запрошення
                    </button>
                    <button type="button" className={submitButtonStyle} onClick={() => handleAcceptInvite(invite._id, false)}>
                        відхилити запрошення
                    </button>
                </div>
            </div>
        })}
    </div>
}

export default observer(InvitesToUserMapper);