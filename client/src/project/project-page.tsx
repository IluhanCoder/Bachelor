import { useParams } from "react-router-dom";
import projectService from "./project-service";
import { useEffect, useState } from "react";
import { ExtendedProjectResponse, ProjectResponse } from "./project-types";
import { submitButtonStyle } from "../styles/button-syles";
import formStore from "../forms/form-store";
import InviteForm from "../invite/invite-form";
import inviteService from "../invite/invite-service";
import { UserResponse } from "../user/user-types";

function ProjectPage () {
    const [project, setProject] = useState<ExtendedProjectResponse>();

    const {projectId} = useParams();

    const getProjectData = async () => {
        if(projectId === undefined) return;
        const result = await projectService.getProjectById(projectId);
        setProject({...result.project});
    }

    const handleAddUser = async () => {
        if(project) {
            await formStore.setForm(<InviteForm projectId={project?._id}/>);
        }
    }

    useEffect(() => {
        getProjectData();
    }, [projectId])

    return <div>
        {project && <div>
            <div>
                {project?.name}
            </div>
            
            {project.invited.length > 0 && <div>
                <div>
                    запрошені користувачі:
                </div>
                {project?.invited.map((user: UserResponse) => <div>{user.nickname}</div>)}
            </div>}
            <button type="button" className={submitButtonStyle} onClick={handleAddUser}>
                запросити користувача
            </button>
        </div>}
    </div>
}

export default ProjectPage;