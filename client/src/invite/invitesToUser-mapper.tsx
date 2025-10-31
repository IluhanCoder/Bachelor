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

    return <div className="w-full max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Запрошення до проєктів</h2>
            {invites.length > 0 && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    {invites.length}
                </span>
            )}
        </div>
        
        {invites.length > 0 ? (
            <div className="space-y-4">
                {invites.map((invite: InviteToUserResponse) => {
                    return (
                        <div 
                            key={invite._id}
                            className="bg-white rounded-xl shadow-sm border-2 border-blue-200 hover:border-blue-300 transition-all p-6 hover:shadow-md"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                                            {invite.project.name[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900">
                                                {invite.project.name}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                <span>Запрошує:</span>
                                                <Link 
                                                    className="font-medium text-blue-600 hover:text-blue-700 hover:underline" 
                                                    to={`/profile/${invite.host._id}`}
                                                >
                                                    {invite.host.nickname}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                                <button 
                                    type="button" 
                                    className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                                    onClick={() => handleAcceptInvite(invite._id, true)}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Прийняти
                                </button>
                                <button 
                                    type="button" 
                                    className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                    onClick={() => handleAcceptInvite(invite._id, false)}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Відхилити
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        ) : (
            <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-xl border-2 border-dashed border-slate-200 p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-1">Запрошення відсутні</h3>
                <p className="text-sm text-slate-500">Коли вас запросять до проєкту, ви побачите запрошення тут</p>
            </div>
        )}
    </div>
}

export default observer(InvitesToUserMapper);