import DateFormater from "../misc/date-formatter";
import ParticipantsWindow from "./participants-window";
import { ProjectResponse } from "./project-types";

interface LocalParams {
    project: ProjectResponse
}

function ProjectCard({project}: LocalParams) {
    return <div className="bg-white rounded shadow-sm border-1 py-6 px-8 flex flex-col gap-2">
        <div>
            <div className="font-semibold text-xl">{project.name}</div>
        </div>
        <div>
            <div>
                <label>Створено: </label>
                <label className="font-light text-gray-700"><DateFormater value={project.created} dayOfWeek/></label>
            </div>
        </div>
        <div className="flex flex-col gap-2 text-gray-600 text-xs">
            <label>Учасники проекту:</label>
            <ParticipantsWindow participants={project.participants} maxDisplay={10}/>
        </div>
    </div>
}

export default ProjectCard;