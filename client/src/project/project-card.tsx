import { useNavigate } from "react-router-dom";
import DateFormater from "../misc/date-formatter";
import ParticipantsWindow from "./participants-window";
import { ProjectResponse } from "./project-types";
import { Link } from "react-router-dom";
import { linkStyle } from "../styles/form-styles";

interface LocalParams {
    project: ProjectResponse
}

function ProjectCard({project}: LocalParams) {
    const navigate = useNavigate();

    const handleClick = (projectId: string) => {
        navigate(`/project/${projectId}`);
    }

    return (
        <button 
            type="button" 
            className="group flex flex-col bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-200 p-6 gap-4 transition-all duration-200 hover:-translate-y-1 text-left"
            onClick={() => handleClick(project._id)}
        >
            {/* Header */}
            <div className="flex items-start justify-between">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {project.name}
                </h3>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>

            {/* Details */}
            <div className="flex flex-col gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Створено: <DateFormater value={project.created} dayOfWeek/></span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Власник: </span>
                    <Link className="text-blue-600 hover:text-blue-700 font-medium hover:underline" to={`/profile/${project.owner._id}`}>
                        {project.owner.nickname}
                    </Link>
                </div>
            </div>

            {/* Participants */}
            <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Учасники</span>
                    <span className="text-xs text-gray-400">{project.participants.length}</span>
                </div>
                <ParticipantsWindow participants={project.participants} maxDisplay={8}/>
            </div>
        </button>
    );
}

export default ProjectCard;