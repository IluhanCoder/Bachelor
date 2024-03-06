import { useEffect, useState } from "react";
import Task, { TaskResponse } from "./task-types";
import taskService from "./task-service";
import { useParams } from "react-router-dom";
import userStore from "../user/user-store";
import { UserResponse } from "../user/user-types";
import { Rights } from "../project/project-types";
import projectService from "../project/project-service";


function BoardWindow() {
    const {projectId} = useParams();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [isFiltered, setIsFiltered] = useState<boolean>(false);
    const [rights, setRights] = useState<Rights>();

    const getData = async () => {
        if(projectId) {
            const result = await taskService.getProjectTasks(projectId);
            setTasks([...result.tasks]);
        }
    }

    const handleMove = async (taskId: string, statusIndex: number) => {
        await taskService.setStatus(taskId, statusIndex);
        getData();
    }

    const getUserRights = async () => {
        if(projectId) {
            const result = await projectService.getUserRights(projectId);
            setRights({...result.rights});
        }
    }

    const currentUserIsExecutor = (task: Task) => {
        const executor = task.executors.find((executor: string) => executor === userStore.user?._id);
        return executor !== undefined
    }

    useEffect(() => { getData(); getUserRights(); }, [projectId]);

    return <div>
        <div>
            <input type="checkbox" checked={isFiltered} onChange={() => setIsFiltered(!isFiltered)}/>
            <label>тільки завдання, назначені вам</label>
        </div>
        <div className="w-full grid grid-cols-3 gap-4">
            <div className="bg-gray-100 rounded p-4">
                <div>Треба зробити:</div>
                {tasks.map((task: Task) => {
                    if((!isFiltered || currentUserIsExecutor(task)) &&  task.status === "toDo") return <div>
                        <div>{task.name}</div>
                        {(currentUserIsExecutor(task) || rights?.check) && <div>
                            <button onClick={() => handleMove(task._id, 1)}>{"=>"}</button>
                        </div>}
                    </div>
                })}
            </div>
            <div className="bg-gray-100 rounded p-4">
                <div>В процесі:</div>
                {tasks.map((task) => {
                    if((!isFiltered || currentUserIsExecutor(task)) && task.status === "inProgress") return <div>
                        {(currentUserIsExecutor(task) || rights?.check) && <div>
                            <button onClick={() => handleMove(task._id, 0)}>{"<="}</button>
                        </div>}
                        <div>{task.name}</div>
                        {(currentUserIsExecutor(task) || rights?.check) && <div>
                            <button onClick={() => handleMove(task._id, 2)}>{"=>"}</button>
                        </div>}
                    </div>
                })}
            </div>
            <div className="bg-gray-100 rounded p-4">
                <div>Виконано</div>
                {tasks.map((task: Task) => {
                    if((!isFiltered || currentUserIsExecutor(task)) && task.status === "done") return <div>
                        {(currentUserIsExecutor(task) || rights?.check) && <div>
                            <button onClick={() => handleMove(task._id, 1)}>{"<="}</button>
                        </div>}
                        <div>{task.name}</div>
                    </div>
                })}
            </div>
        </div>
    </div>
}

export default BoardWindow;