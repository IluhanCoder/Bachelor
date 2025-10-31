import { useNavigate, useParams } from "react-router-dom";
import projectService from "./project-service";
import { ChangeEvent, useEffect, useState } from "react";
import { ExtendedProjectResponse, ParticipantResponse, ProjectResponse, Rights } from "./project-types";
import { grayButtonStyle, redButtonSyle, submitButtonStyle } from "../styles/button-syles";
import formStore from "../forms/form-store";
import InviteForm from "../invite/invite-form";
import inviteService from "../invite/invite-service";
import { UserResponse } from "../user/user-types";
import userStore from "../user/user-store";
import { observer } from "mobx-react";
import BacklogTasksTile from "../task/tasks-mapper";
import NewTaskForm from "../task/new-task-form";
import NewBacklogForm from "../backlogs/new-backlog-form";
import BacklogSprintsMapper from "../sprint/backlog-sprints-mapper";
import BacklogMapper from "../backlogs/backlogs-mapper";
import taskService from "../task/task-service";
import NewOwnerForm from "./new-owner-form";
import Avatar from "react-avatar";
import { convertImage } from "./participants-window";
import LoadingScreen from "../misc/loading-screen";
import { Link } from "react-router-dom";
import { VscGraphLine, VscOrganization, VscTable } from "react-icons/vsc";

function ProjectPage () {
    const [project, setProject] = useState<ExtendedProjectResponse | null>(null);
    const [rights, setRights] = useState<Rights>();
    const [showMenu, setShowMenu] = useState(false);

    const navigate = useNavigate();

    const {projectId} = useParams();

    const getProjectData = async () => {
        if(projectId === undefined) return;
        const result = await projectService.getProjectById(projectId);
        console.log(result);
        setProject({...result.project});
    }

    const getUserRights = () => {
        if(project?.owner._id === userStore.user?._id) {
            setRights({
            create: true,
            edit: true,
            delete: true,
            check: true,
            editParticipants: true,
            addParticipants: true,
            editProjectData: true,
            manageSprints: true,
            manageBacklogs: true
            });
            return; }
        const currentUser = project?.participants.find((participant: ParticipantResponse) => 
            participant.participant._id === userStore.user?._id);
        const userRights = currentUser?.rights;
        setRights(userRights);
    }

    const handleAddUser = async () => {
        if(project)
            await formStore.setForm(<InviteForm project={project} callBack={getProjectData}/>);
    }

    const handleLeave = async () => {
        if(project) {
            await projectService.leaveProject(project?._id);
            navigate("/");
        }
    }

    const handleDeleteParticipant = async(participantId: string) => {
        if(project) {
            await projectService.deleteParticipant(project?._id, participantId);
            await getProjectData();
        }
    }

    const handleCancelInvite = async(guestId: string) => {
        if(project) {
            await inviteService.deleteInvite(guestId, project?._id);
            await getProjectData();
        }
    }

    const handleCreateBacklog = () => {
        if(project) {
            formStore.setForm(<NewBacklogForm projectId={project._id} callBack={getProjectData}/>)
        }
    }

    const handleChangeOwner = () => {
        if(project) {
            formStore.setForm(<NewOwnerForm project={project} callBack={getProjectData}/>);
        }
    }

    const handleProjectDelete = async () => {
        if(projectId) {
            await projectService.deleteProject(projectId);
            navigate("/projects");
        }
    }

    useEffect(() => {
        getProjectData();
    }, [projectId])

    useEffect(() => {
        getUserRights();
    }, [project]);

    if(project) return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>Owner: {project.owner.nickname}</span>
                                <span className="mx-2">•</span>
                                <span>{project.participants.length} participants</span>
                            </div>
                        </div>
                        
                        {/* Project Menu */}
                        <div className="relative">
                            <button 
                                onClick={() => setShowMenu(!showMenu)}
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                aria-label="Project Menu"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                </svg>
                            </button>
                            
                            {showMenu && (
                                <>
                                    {/* Backdrop to close menu */}
                                    <div 
                                        className="fixed inset-0 z-10" 
                                        onClick={() => setShowMenu(false)}
                                    />
                                    
                                    {/* Menu dropdown */}
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20 animate-fadeIn">
                                        {project.owner._id === userStore.user?._id && (
                                            <>
                                                <button 
                                                    className="w-full px-4 py-2.5 text-left text-sm font-medium text-orange-700 hover:bg-orange-50 transition-colors flex items-center gap-3"
                                                    type="button" 
                                                    onClick={() => {
                                                        setShowMenu(false);
                                                        handleChangeOwner();
                                                    }}
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                                    </svg>
                                                    Change Owner
                                                </button>
                                                <div className="border-t border-gray-100 my-1" />
                                                <button 
                                                    type="button" 
                                                    className="w-full px-4 py-2.5 text-left text-sm font-medium text-red-700 hover:bg-red-50 transition-colors flex items-center gap-3"
                                                    onClick={() => {
                                                        setShowMenu(false);
                                                        if(window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
                                                            handleProjectDelete();
                                                        }
                                                    }}
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Delete Project
                                                </button>
                                            </>
                                        )}
                                        {project.owner._id !== userStore.user?._id && (
                                            <button 
                                                type="button" 
                                                className="w-full px-4 py-2.5 text-left text-sm font-medium text-red-700 hover:bg-red-50 transition-colors flex items-center gap-3"
                                                onClick={() => {
                                                    setShowMenu(false);
                                                    if(window.confirm('Are you sure you want to leave this project?')) {
                                                        handleLeave();
                                                    }
                                                }}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Leave Project
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content - Backlogs */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">Backlogs</h2>
                                {rights?.manageBacklogs && (
                                    <button 
                                        onClick={handleCreateBacklog} 
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Create Backlog
                                    </button>
                                )}
                            </div>
                            {project && rights && (
                                <BacklogMapper rights={rights} projectId={project._id}/>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3">
                            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <Link 
                                to={`/analytics/${project._id}`} 
                                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors group"
                            >
                                <VscGraphLine className="w-5 h-5 text-blue-600" strokeWidth={1.25}/>
                                <span className="font-medium">Project Analytics</span>
                                <svg className="w-4 h-4 ml-auto text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                            <Link 
                                to={`/board/${project._id}`} 
                                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors group"
                            >
                                <VscTable className="w-5 h-5 text-green-600" strokeWidth={0.6}/>
                                <span className="font-medium">Task Board</span>
                                <svg className="w-4 h-4 ml-auto text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                            {rights?.editParticipants && (
                                <Link 
                                    to={`/rights/${project._id}`} 
                                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors group"
                                >
                                    <VscOrganization className="w-5 h-5 text-purple-600" strokeWidth={0.4}/>
                                    <span className="font-medium">Participant Rights</span>
                                    <svg className="w-4 h-4 ml-auto text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            )}
                        </div>

                        {/* Owner Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Project Owner</h3>
                            <div className="flex items-center gap-3">
                                <Avatar 
                                    round 
                                    size="48" 
                                    name={project.owner.nickname} 
                                    src={project.owner.avatar ? convertImage(project.owner.avatar) : ""}
                                />
                                <div>
                                    <div className="font-semibold text-gray-900">{project.owner.nickname}</div>
                                    <div className="text-sm text-gray-500">Administrator</div>
                                </div>
                            </div>
                        </div>

                        {/* Participants */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Participants</h3>
                                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{project.participants.length}</span>
                            </div>
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {project.participants.map((participant: ParticipantResponse) => {
                                    if(participant.participant && participant.participant._id) return (
                                        <div key={participant.participant._id} className="flex items-center justify-between gap-3 py-2">
                                            <div className="flex items-center gap-2 min-w-0 flex-1">
                                                <Avatar 
                                                    round 
                                                    size="32" 
                                                    name={participant.participant.nickname} 
                                                    src={participant.participant.avatar ? convertImage(participant.participant.avatar) : ""}
                                                />
                                                <span className="text-sm font-medium text-gray-700 truncate">{participant.participant.nickname}</span>
                                            </div>
                                            {rights?.editParticipants && (
                                                <button 
                                                    type="button" 
                                                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                                                    onClick={() => handleDeleteParticipant(participant.participant._id)}
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    );
                                    return null;
                                })}
                            </div>
                            {rights?.addParticipants && (
                                <button 
                                    type="button" 
                                    className="w-full mt-4 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                                    onClick={handleAddUser}
                                >
                                    + Add Participant
                                </button>
                            )}
                        </div>

                        {/* Invited Users */}
                        {project.invited.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Invited</h3>
                                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{project.invited.length}</span>
                                </div>
                                <div className="space-y-3">
                                    {project.invited.map((user: UserResponse) => (
                                        <div key={user._id} className="flex items-center justify-between gap-3 py-2">
                                            <div className="flex items-center gap-2 min-w-0 flex-1">
                                                <Avatar 
                                                    round 
                                                    size="32" 
                                                    name={user.nickname} 
                                                    src={user.avatar ? convertImage(user.avatar) : ""}
                                                />
                                                <span className="text-sm font-medium text-gray-700 truncate">{user.nickname}</span>
                                            </div>
                                            {rights?.editParticipants && (
                                                <button 
                                                    type="button" 
                                                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                                                    onClick={() => handleCancelInvite(user._id)}
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
    else return <LoadingScreen/>
}

export default observer(ProjectPage);