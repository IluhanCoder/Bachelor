import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { InviteToUserResponse } from "./invite-types";
import inviteService from "./invite-service";
import userStore from "../user/user-store";

function InvitesToUserMapper () {
    const [invites, setInvites] = useState<InviteToUserResponse[]>([]);

    const getInvites = async () => {
        if(userStore.user) {
            const result = await inviteService.getInvitesToUser();
            setInvites([...result.invites]);
        }
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
            </div>
        })}
    </div>
}

export default observer(InvitesToUserMapper);