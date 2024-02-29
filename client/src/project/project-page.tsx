import { useParams } from "react-router-dom";
import projectService from "./project-service";
import { useEffect, useState } from "react";
import { ProjectResponse } from "./project-types";
import { submitButtonStyle } from "../styles/button-syles";
import formStore from "../forms/form-store";
import UserSearchForm from "../user/user-search-form";

interface LocalParams {
    projectId: string
}

function ProjectPage () {
    const [project, setProject] = useState<ProjectResponse>();

    const {projectId} = useParams();

    const getProjectData = async () => {
        if(projectId === undefined) return;
        const result = await projectService.getProjectById(projectId);
        setProject(result.project);
    }

    const handleAddUser = () => {
        formStore.setForm(<UserSearchForm/>);
    }

    useEffect(() => {
        getProjectData();
    }, [projectId])

    return <div>
        {JSON.stringify(project)}
        <div>
            <button type="button" className={submitButtonStyle} onClick={handleAddUser}>
                запросити користувача
            </button>
        </div>
    </div>
}

export default ProjectPage;