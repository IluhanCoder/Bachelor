import Avatar from "react-avatar";
import { UserResponse } from "../user/user-types";
import { ParticipantResponse } from "./project-types";
import { Buffer } from "buffer";
import { observer } from "mobx-react";

interface LocalParams {
    participants: ParticipantResponse[],
    maxDisplay?: number 
}

export const convertImage = (image: any) => {
    const base64String = `data:image/jpeg;base64,${image.data}`;
    return base64String;
};

function ParticipantsWindow({participants, maxDisplay}: LocalParams) {
    if(Object.keys(participants[0]).length > 0)
        return <div className="flex gap-1">
            {participants.slice(0,maxDisplay).map((participant: ParticipantResponse, index) => 
                <Avatar name={participant.participant?.nickname} round size="30" textMarginRatio={.15} src={participant.participant.avatar ? convertImage(participant.participant.avatar) : ""}/>)}
            {(maxDisplay && participants.length > maxDisplay) && <div className="mt-2 text-gray-600 font-semibold">та ще {participants.length - maxDisplay} ...</div>}
        </div>
    else return <div className="text-gray-400 pl-2">
        учасників нема
    </div>
}

export default observer(ParticipantsWindow);