import { useEffect, useState } from "react";
import { TaskResponse } from "./task-types";
import taskService from "./task-service";
import TasksMapper from "./tasks-mapper";
import { SprintResponse } from "../sprint/sprint-types";
import { UserResponse } from "../user/user-types";
import { lightButtonStyle, redButtonSyle } from "../styles/button-syles";
import TaskStatusDisplayer from "./task-status-diplayer";
import { Rights } from "../project/project-types";
import TaskPriorityDisplayer from "./task-priority-displayer";
import userStore from "../user/user-store";

interface LocalParams {
    sprint: SprintResponse,
    pullHandler: (taskId: string) => {},
    assignHandler: (task: TaskResponse) => void,
    deleteHandler: (taskId: string) => void,
    detailsHandler: (taskId: string) => void,
    rights: Rights
}

function SprintTasksMapper ({sprint, pullHandler, deleteHandler, detailsHandler, rights}: LocalParams) {
    const [tasks, setTasks] = useState<TaskResponse[]>([]);

    const getTasks = async () => {
        const result = await taskService.getSprintTasks(sprint._id);
        setTasks([...result.tasks]);
    }

    useEffect(() => { getTasks() }, [sprint]);

    // Filter out tasks without name
    const validTasks = tasks.filter(task => task && task.name);

    // Helper function to check if user is creator of the task
    const isCreator = (task: TaskResponse) => {
        if (!userStore.user || !task.createdBy) return false;
        const createdById = typeof task.createdBy === 'string' 
            ? task.createdBy 
            : (task.createdBy as any)._id || (task.createdBy as any).toString();
        return createdById === userStore.user._id;
    };

    if(validTasks && validTasks.length > 0) return (
        <div className="space-y-2">
            {validTasks.map((task: TaskResponse) => {
                const isOwnTask = isCreator(task);
                const canPull = rights.edit || (isOwnTask && rights.create);
                const canDelete = rights.delete || (isOwnTask && rights.create);
                
                return (
                <div 
                    key={task._id}
                    className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-3 transition-all"
                >
                    <div className="flex items-center justify-between gap-3">
                        {/* Task Name */}
                        <div className="flex-1 min-w-0">
                            <h6 className="font-medium text-gray-900 text-sm truncate">{task.name}</h6>
                        </div>

                        {/* Status */}
                        <div className="flex-shrink-0">
                            <TaskStatusDisplayer status={task.status}/>
                        </div>

                        {/* Priority */}
                        <div className="flex-shrink-0">
                            <TaskPriorityDisplayer priority={task.priority}/>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-1.5 flex-shrink-0">
                            <button 
                                type="button" 
                                className="px-2.5 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                                onClick={() => detailsHandler(task._id)}
                            >
                                Деталі
                            </button>
                            {canPull && (
                                <button 
                                    type="button" 
                                    className="px-2.5 py-1 text-xs font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded hover:bg-orange-100 transition-colors"
                                    onClick={() => pullHandler(task._id)}
                                >
                                    Прибрати
                                </button>
                            )}
                            {canDelete && (
                                <button 
                                    type="button" 
                                    className="px-2.5 py-1 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors"
                                    onClick={() => deleteHandler(task._id)}
                                >
                                    Видалити
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )})}
        </div>
    );
    else return (
        <div className="text-center py-6">
            <p className="text-sm text-gray-400">Задачі відсутні</p>
        </div>
    );
}

export default SprintTasksMapper;