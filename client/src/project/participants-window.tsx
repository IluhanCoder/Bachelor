import Avatar from "react-avatar";
import { UserResponse } from "../user/user-types";
import { ParticipantResponse } from "./project-types";

interface LocalParams {
    participants: ParticipantResponse[],
    maxDisplay?: number 
}

function ParticipantsWindow({participants, maxDisplay}: LocalParams) {
    return <div className="flex gap-1">
        {participants.slice(0,maxDisplay).map((participant: ParticipantResponse, index) => 
            <Avatar name={participant.participant.nickname} round size="30" textMarginRatio={.15}/>)}
        {(maxDisplay && participants.length > maxDisplay) && <div className="mt-2 text-gray-600 font-semibold">та ще {participants.length - maxDisplay} ...</div>}
    </div>
}

export default ParticipantsWindow;