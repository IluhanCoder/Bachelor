import { useNavigate, useParams } from "react-router-dom";
import projectService from "./project-service";
import { useEffect, useState } from "react";
import { ExtendedProjectResponse, ParticipantResponse, ProjectResponse, Rights } from "./project-types";
import { submitButtonStyle } from "../styles/button-syles";
import formStore from "../forms/form-store";
import InviteForm from "../invite/invite-form";
import inviteService from "../invite/invite-service";
import { UserResponse } from "../user/user-types";
import userStore from "../user/user-store";
import { observer } from "mobx-react";

function ProjectPage () {
    const [project, setProject] = useState<ExtendedProjectResponse>();
    const [rights, setRights] = useState<Rights>();

    const navigate = useNavigate();

    const {projectId} = useParams();

    const getProjectData = async () => {
        if(projectId === undefined) return;
        const result = await projectService.getProjectById(projectId);
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
            await formStore.setForm(<InviteForm projectId={project?._id}/>);
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

    useEffect(() => {
        getProjectData();
    }, [projectId])

    useEffect(() => {
        getUserRights();
    }, [project]);

    return <div>
        {project && <div>
            <div>
                {project?.name}
            </div>
            <div>
                {project.participants.map((participant: ParticipantResponse) => {
                    return <div>
                        {participant.participant.name}
                        {rights?.editParticipants && 
                        <div>
                            <button type="button" className={submitButtonStyle} 
                                onClick={() => handleDeleteParticipant(participant.participant._id)}>
                                видалити користувача
                            </button>
                        </div>}
                    </div>
                })}
            </div>
            {project.invited.length > 0 && <div>
                <div>
                    запрошені користувачі:
                </div>
                {project?.invited.map((user: UserResponse) => <div>{user.nickname}</div>)}
            </div>}
            {rights?.editParticipants && <button type="button" className={submitButtonStyle} onClick={handleAddUser}>
                запросити користувача
            </button>}
        </div>}
        {project?.owner._id === userStore.user?._id && 
            <button type="button" className={submitButtonStyle}>
                видалити проект
            </button> || 
            <button type="button" className={submitButtonStyle} onClick={handleLeave}>
                покинути проект
            </button>}
    </div>
}

export default observer(ProjectPage);