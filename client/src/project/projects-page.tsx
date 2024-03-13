import { useEffect, useState } from "react";
import Project, { ProjectResponse } from "./project-types";
import projectService from "./project-service";
import userStore from "../user/user-store";
import { observer } from "mobx-react";
import ProjectCard from "./project-card";
import { submitButtonStyle } from "../styles/button-syles";
import formStore from "../forms/form-store";
import NewProjectForm from "./new-project-form";

function ProjectsPage () {
    const user = userStore.user;

    const [projects, setProjects] = useState<ProjectResponse[]>([]);

    const fetchProjects = async () => {
        if(!user) {
            return;
        }
        const result = await projectService.getUserProjects();
        setProjects(result);
    }

    const handleNewProject = () => {
        formStore.setForm(<NewProjectForm/>);
    }

    useEffect(() => {fetchProjects()}, [user]);

    return <div className="bg-gray-100 flex flex-col gap-2 p-4 h-full">
        <div className="py-2 px-6 font-bold text-xl text-gray-700 text-center">
            Проекти
        </div>
        {projects.length > 0 && <div className="grow overflow-auto">
            <div className="grid grid-cols-2 gap-6">
            {projects.map((project: ProjectResponse) => {
                return <ProjectCard project={project}/>
            })}</div></div> || <div className="grow text-center pt-48 text-2xl font-bold text-gray-600">проекти відсутні</div>}
        <div className="flex justify-center">
            <button type="button" className={submitButtonStyle} onClick={handleNewProject}>створити новий проект</button>
        </div>
    </div>
}

export default observer(ProjectsPage);