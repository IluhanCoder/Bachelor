import { useEffect, useState } from "react";
import Project, { ProjectResponse } from "./project-types";
import projectService from "./project-service";
import userStore from "../user/user-store";
import { observer } from "mobx-react";
import ProjectCard from "./project-card";
import { submitButtonStyle } from "../styles/button-syles";
import formStore from "../forms/form-store";
import NewProjectForm from "./new-project-form";
import LoadingScreen from "../misc/loading-screen";
import { inputStyle } from "../styles/form-styles";

function ProjectsPage () {
    const user = userStore.user;

    const [projects, setProjects] = useState<ProjectResponse[] | null>(null);
    const [filteredProjects, setFilteredProjects] = useState<ProjectResponse[]>([]);
    const [filter, setFilter] = useState<string>("");

    const filterProject = () => {
        const newData = projects?.filter((project: ProjectResponse) => project.name.toUpperCase().includes(filter.toUpperCase()));
        if(newData) setFilteredProjects([...newData]);
    }

    const fetchProjects = async () => {
        if(!user) {
            return;
        }
        const result = await projectService.getUserProjects();
        setProjects(result);
        setFilteredProjects(result);
    }

    const handleNewProject = () => {
        formStore.setForm(<NewProjectForm callBack={(fetchProjects)}/>);
    }

    useEffect(() => {fetchProjects()}, [user]);
    useEffect(() => {filterProject()}, [filter]);

    if(projects) return <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Мої проекти</h1>
                <p className="text-gray-600">Керуйте своїми проєктами в одному місці</p>
            </div>

            {/* Search and Create */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input 
                        type="text" 
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                        placeholder="Пошук проєктів..."
                        value={filter} 
                        onChange={(e: any) => setFilter(e.target.value)}
                    />
                </div>
                <button 
                    type="button" 
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                    onClick={handleNewProject}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Створити проєкт
                </button>
            </div>

            {/* Projects Grid */}
            {projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProjects.map((project: ProjectResponse) => (
                        <ProjectCard key={project._id} project={project}/>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <svg className="mx-auto w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Проєкти відсутні</h3>
                    <p className="text-gray-500">Створіть свій перший проєкт, щоб почати</p>
                </div>
            )}
        </div>
    </div>
    else return <LoadingScreen/>
}

export default observer(ProjectsPage);