import { useParams } from "react-router-dom";
import projectService from "./project-service";
import { useEffect, useState } from "react";
import { ProjectResponse } from "./project-types";

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

    useEffect(() => {
        getProjectData();
    }, [projectId])

    return <div>
        {JSON.stringify(project)}
    </div>
}

export default ProjectPage;