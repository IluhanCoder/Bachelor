import { ChangeEvent, useEffect, useState } from "react";
import { Participant, ParticipantResponse, Rights } from "./project-types";
import projectService from "./project-service";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Avatar from "react-avatar";
import { Buffer } from "buffer";

function EditRightsPage () {
    const {projectId} = useParams();

    const [rights, setRights] = useState<ParticipantResponse[]>([]);
    const [formData, setFormData] = useState<Rights[]>([]);

    const getRights = async () => {
        if(projectId) {
            const result = await projectService.getRights(projectId);
            const collectedData: Rights[] = result.rights.map((participant: ParticipantResponse) => participant.rights);
            setRights(result.rights);
            setFormData(collectedData);
        }   
    };

    const checkValue = async (index: number, fieldName: string) => {
        const newData = formData[index];
        newData[fieldName as keyof Rights] = !newData[fieldName as keyof Rights];

        const newFormData = formData;
        newFormData[index] = newData;

        const newRights: Participant[] = rights.map((participant: ParticipantResponse, index: number) => { return {participant: participant.participant._id, rights: newFormData[index]}});
        if(projectId) {
            await projectService.setRights(projectId, newRights); 
            getRights();
        }
    }

    const convertImage = (image: any) => {
        const base64String = `data:image/jpeg;base64,${Buffer.from(image.data).toString('base64')}`;
        return base64String;
    };

    const rightsConfig = [
        { key: 'addParticipants', label: 'Додавати учасників', icon: '👥', color: 'blue' },
        { key: 'check', label: 'Статус задач', icon: '✓', color: 'green' },
        { key: 'create', label: 'Створювати задачі', icon: '➕', color: 'indigo' },
        { key: 'delete', label: 'Видаляти задачі', icon: '🗑️', color: 'red' },
        { key: 'edit', label: 'Редагувати задачі', icon: '✏️', color: 'orange' },
        { key: 'manageSprints', label: 'Керувати спрінтами', icon: '🏃', color: 'teal' },
        { key: 'manageBacklogs', label: 'Керувати беклогами', icon: '📋', color: 'cyan' },
        { key: 'editParticipants', label: 'Видаляти учасників', icon: '👤', color: 'purple' },
        { key: 'editProjectData', label: 'Редагувати проєкт', icon: '⚙️', color: 'slate' },
    ];

    useEffect(() => {getRights()},[]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link 
                        to={`/project/${projectId}`} 
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-700 bg-white border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-all mb-4"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Назад до проєкту
                    </Link>
                    
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Керування правами</h1>
                            <p className="text-slate-600 mt-1">Налаштування прав доступу учасників проєкту</p>
                        </div>
                    </div>
                </div>

                {/* Participants Cards */}
                <div className="space-y-6">
                    {rights.map((right: ParticipantResponse, index: number) => (
                        <div 
                            key={right.participant._id}
                            className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all overflow-hidden"
                        >
                            {/* User Header */}
                            <div className="bg-gradient-to-r from-slate-50 to-blue-50/30 px-6 py-4 border-b border-slate-200">
                                <div className="flex items-center gap-4">
                                    <Avatar 
                                        src={right.participant.avatar ? convertImage(right.participant.avatar.data) : ""} 
                                        name={right.participant.name} 
                                        round 
                                        size="56"
                                        className="ring-2 ring-white shadow-md"
                                    />
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-slate-900">{right.participant.name}</h3>
                                        <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                                            {right.participant.email && (
                                                <div className="flex items-center gap-1.5">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                    {right.participant.email}
                                                </div>
                                            )}
                                            {right.participant.organisation && (
                                                <div className="flex items-center gap-1.5">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                    </svg>
                                                    {right.participant.organisation}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Rights Grid */}
                            <div className="px-6 py-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {rightsConfig.map((rightConfig) => {
                                        const isChecked = formData[index]?.[rightConfig.key as keyof Rights];
                                        return (
                                            <label
                                                key={rightConfig.key}
                                                className={`relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                                    isChecked
                                                        ? `border-${rightConfig.color}-300 bg-${rightConfig.color}-50/50`
                                                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3 flex-1">
                                                    <span className="text-2xl">{rightConfig.icon}</span>
                                                    <span className={`text-sm font-medium ${
                                                        isChecked ? `text-${rightConfig.color}-900` : 'text-slate-700'
                                                    }`}>
                                                        {rightConfig.label}
                                                    </span>
                                                </div>
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={() => checkValue(index, rightConfig.key)}
                                                        className="sr-only peer"
                                                    />
                                                    <div className={`w-11 h-6 rounded-full transition-colors ${
                                                        isChecked 
                                                            ? `bg-${rightConfig.color}-500` 
                                                            : 'bg-slate-300'
                                                    }`}>
                                                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                                                            isChecked ? 'translate-x-5' : 'translate-x-0'
                                                        }`}></div>
                                                    </div>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {rights.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                            <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <p className="text-slate-500 font-medium">Учасники відсутні</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EditRightsPage;