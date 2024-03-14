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

function ProjectPage () {
    const [project, setProject] = useState<ExtendedProjectResponse>();
    const [rights, setRights] = useState<Rights>();

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
            editProjectData: true
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
            getProjectData();
        }
    }

    const handleCancelInvite = async(guestId: string) => {
        if(project) {
            await inviteService.deleteInvite(guestId, project?._id);
            getProjectData();
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

    useEffect(() => {
        getProjectData();
    }, [projectId])

    useEffect(() => {
        getUserRights();
    }, [project]);

    return <div>
        {project && <div className="flex flex-col">
        <div className="flex justify-center p-4">
                        <div className="grow text-center text-3xl">{project?.name}</div>
                        <div className="flex gap-2">{project.owner._id === userStore.user?._id && <div>
                        <button className={redButtonSyle + " text-xs mt-1"} type="button" onClick={handleChangeOwner}>змінити власника проекту</button>
                    </div>}
                    {project?.owner._id === userStore.user?._id && 
                    <button type="button" className={redButtonSyle + " text-xs mt-1"}>
                        видалити проект
                    </button> || 
                    <button type="button" className={redButtonSyle + " text-xs mt-1"} onClick={handleLeave}>
                        покинути проект
                    </button>}</div>
                    </div>
            <div className="flex ">
            
            <div className="flex flex-col grow ">
                    <div>
                        <div>Беклоги:</div>
                        {project && <div>
                            <BacklogMapper projectId={project._id}/>
                        </div>}
                        <div>
                            <button onClick={handleCreateBacklog} className={submitButtonStyle}>створити беклог</button>
                        </div>
                    </div>
            </div>
        
            <div className="p-4 flex flex-col gap-4">
                <div className="flex flex-col gb-gray-50 border">
                    <div className="text-center text-gray-600 font-bold pt-2">
                        Учасники:
                    </div>
                    <div className="flex ">
                        <div className="grow flex gap-2 py-3 px-6 flex-col">{project.participants.map((participant: ParticipantResponse) => {
                            if(participant.participant) return <div className="flex justify-between gap-3">
                                <div className="flex gap-2">
                                    <Avatar round size="30" name={participant.participant.nickname} src={convertImage(participant.participant.avatar)}/>
                                    <div className="text-xl">{participant.participant.nickname}</div>
                                </div>
                                {rights?.editParticipants && 
                                <div>
                                    <button type="button" className={redButtonSyle + " text-xs"} 
                                        onClick={() => handleDeleteParticipant(participant.participant._id)}>
                                        видалити
                                    </button>
                                </div>}
                            </div>
                        })}</div>
                    </div>
                    <div className="flex justify-center px-2 pb-4">{rights?.addParticipants && <button type="button" className={grayButtonStyle + " text-xs"} onClick={handleAddUser}>
                        додати учасника
                    </button>}</div>
                </div>
                {project.invited.length > 0 && <div className="flex flex-col gb-gray-50 border">
                        <div className="text-center text-gray-600 pt-2">
                            Запрошені користувачі:
                        </div>
                        <div className="flex ">
                        <div className="grow flex gap-2 py-3 px-6 flex-col">{project?.invited.map((user: UserResponse) => <div className="flex justify-between gap-3">
                            <div className="flex gap-2">
                                <Avatar round size="30" name={user.nickname} src={convertImage((user.avatar) ? user.avatar : "")}/>
                                <div className="text-xl">{user.nickname}</div>
                            </div>
                            {rights?.editParticipants && <div>
                                <button type="button" className={redButtonSyle + " text-xs"}  onClick={() => handleCancelInvite(user._id)}>скасувати</button>
                            </div>}
                        </div>)}</div></div>
                    </div>}
            </div>
        </div></div>}
        
    </div>
}

export default observer(ProjectPage);