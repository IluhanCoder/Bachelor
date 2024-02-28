import { useEffect, useState } from "react";
import Project, { ProjectResponse } from "./project-types";
import projectService from "./project-service";
import userStore from "../user/user-store";
import { observer } from "mobx-react";
import ProjectCard from "./project-card";

function ProjectsPage () {
    const user = userStore.user;

    const [projects, setProjects] = useState<ProjectResponse[]>([]);
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

    return <div className="bg-gray-100 flex flex-col gap-2 p-4">
        <div className="py-2 px-6 font-bold text-xl text-gray-700">
            Проекти
        </div>
        <div className="grid grid-cols-2 gap-2">
            {projects.map((project: ProjectResponse) => {
                return <ProjectCard project={project}/>
            })}</div>
        <div>
            <input type="text" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)}/>
            <button type="button" onClick={handleNewProject}>створити новий проект</button>
        </div>
    </div>
}

export default observer(ProjectsPage);