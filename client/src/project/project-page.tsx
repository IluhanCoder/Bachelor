import { useParams } from "react-router-dom";
import projectService from "./project-service";
import { useEffect, useState } from "react";
import { ProjectResponse } from "./project-types";
import { submitButtonStyle } from "../styles/button-syles";
import formStore from "../forms/form-store";
import InviteForm from "../invite/invite-form";
import inviteService from "../invite/invite-service";
import { UserResponse } from "../user/user-types";

function ProjectPage () {
    const [project, setProject] = useState<ProjectResponse>();
    const [invited, setInvited] = useState<UserResponse[]>([]);

    const {projectId} = useParams();

    const getProjectData = async () => {
        if(projectId === undefined) return;
        const result = await projectService.getProjectById(projectId);
        setProject(result.project);
    }

    const getInvited = async () => {
        if(projectId === undefined) return;
        const result = await inviteService.getInvited(projectId);
        setInvited(result.invited);
    }

    const handleAddUser = () => {
        if(project) formStore.setForm(<InviteForm projectId={project?._id}/>);
    }

    useEffect(() => {
        getProjectData();
        getInvited();
    }, [projectId])

    return <div>
        {JSON.stringify(project)}
        <div>
            <div>
                {invited.map((user: UserResponse) => <div>{user.nickname}</div>)}
            </div>
            <button type="button" className={submitButtonStyle} onClick={handleAddUser}>
                запросити користувача
            </button>
        </div>
    </div>
}

export default ProjectPage;