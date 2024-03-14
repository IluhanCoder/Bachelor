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

    return <button type="button" className="flex flex-col bg-white rounded shadow-sm border-1 py-6 px-8 gap-2 hover:scale-105 transition-transform duration-300 ease-in-out" onClick={() => handleClick(project._id)}>
            <div className="flex flex-start">
                <div className="font-semibold text-xl">{project.name}</div>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex flex-start gap-1">
                    <label>Створено: </label>
                    <label className="font-light text-gray-700"><DateFormater value={project.created} dayOfWeek/></label>
                </div>
                <div className="flex flex-start gap-1">
                    <label>Власник проекту: </label>
                    <label>
                        <Link className={linkStyle} to={`/profile/${project.owner._id}`}>{project.owner.nickname}</Link>
                    </label>
                </div>
            </div>
            <div className="flex flex-col gap-2 text-gray-600 text-xs">
                <label className="flex flex-start">Учасники проекту:</label>
                <div className="flex flex-start">
                    <ParticipantsWindow participants={project.participants} maxDisplay={10}/>
                </div>
            </div>
    </button>
}

export default ProjectCard;