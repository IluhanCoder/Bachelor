import { useEffect, useState } from "react";
import Project from "./project-types";
import projectService from "./project-service";
import userStore from "../user/user-store";
import { observer } from "mobx-react";

function ProjectsPage () {
    const user = userStore.user;

    const [projects, setProjects] = useState<Project[]>([]);
    const [newProjectName, setNewProjectName] = useState<string>("");

    const handleNewProject = async () => {
        await projectService.newProject(newProjectName);
    }

    const fetchProjects = async () => {
        if(!user) {
            return;
        }
        const result = await projectService.getUserProjects();
        setProjects(result);
    }

    useEffect(() => {fetchProjects()}, [user]);

    return <div>
        {projects.map((project: Project) => {
            return <div>{project.name}</div>
        })}
        <div>
            <input type="text" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)}/>
            <button type="button" onClick={handleNewProject}>створити новий проект</button>
        </div>
    </div>
}

export default observer(ProjectsPage);