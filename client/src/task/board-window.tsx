import { useEffect, useState } from "react";
import Task, { TaskResponse } from "./task-types";
import taskService from "./task-service";
import { useParams } from "react-router-dom";
import userStore from "../user/user-store";
import { UserResponse } from "../user/user-types";
import { Rights } from "../project/project-types";
import projectService from "../project/project-service";
import { VscTriangleLeft, VscTriangleRight } from "react-icons/vsc";
import formStore from "../forms/form-store";
import TaskInfoForm from "./task-info-form";
import { Link } from "react-router-dom";
import { lightButtonStyle } from "../styles/button-syles";
import LoadingScreen from "../misc/loading-screen";


function BoardWindow() {
    const {projectId} = useParams();

    const [tasks, setTasks] = useState<Task[] | null>(null);
    const [isFiltered, setIsFiltered] = useState<boolean>(false);
    const [rights, setRights] = useState<Rights>();
    const [ownerId, setOwnerId] = useState<string>();

    const getData = async () => {
        if(projectId) {
            const result = await taskService.getProjectTasks(projectId);
            setTasks([...result.tasks]);
            const ownerResult = await projectService.getOwnerId(projectId);
            setOwnerId(ownerResult.ownerId);
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

    const currentUserIsExecutorOrOwner = (task: Task) => {
        const executor = task.executors.find((executor: string) => executor === userStore.user?._id);
        return executor !== undefined || ownerId === userStore.user?._id
    }

    const handleTaskClick = (taskId: string) => {
        if(projectId && rights) formStore.setForm(<TaskInfoForm rights={rights} taskId={taskId} callBack={getData} projectId={projectId}/>)
    }

    useEffect(() => { getData(); getUserRights(); }, [projectId]);

    if(tasks) return <div className="flex flex-col gap-3 p-4">
        <div className="py-2">
            <Link to={`/project/${projectId}`} className={lightButtonStyle}>Назад до проекту</Link>
        </div>
        <div className="w-full grid grid-cols-3 gap-4">
            <div className="bg-gray-100 rounded p-4 flex flex-col gap-2">
                <div className="text-gray-600 font-bold">Треба виконати:</div>
                {tasks.map((task: Task) => {
                    if((!isFiltered || currentUserIsExecutorOrOwner(task)) &&  task.status === "toDo") return <div className="grid grid-cols-3 bg-white rounded py-2 px-4 border">
                        <div></div>
                        <div className="mt-1 flex justify-center"><button type="button" onClick={() => handleTaskClick(task._id)}>{task.name}</button></div>
                        {(currentUserIsExecutorOrOwner(task) || rights?.check) && <div className="flex justify-end">
                            <button onClick={() => handleMove(task._id, 1)} className="mt-1"><VscTriangleRight className="bg-blue-600 p-1 rounded text-white text-2xl"/></button>
                        </div>}
                    </div>
                })}
            </div>
            <div className="bg-gray-100 rounded p-4 flex flex-col gap-2">
                <div className="text-gray-600 font-bold">В процесі:</div>
                {tasks.map((task) => {
                    if((!isFiltered || currentUserIsExecutorOrOwner(task)) && task.status === "inProgress") return <div className="grid grid-cols-3 bg-white rounded py-2 px-4 border">
                        {(currentUserIsExecutorOrOwner(task) || rights?.check) && <div>
                            <button onClick={() => handleMove(task._id, 0)} className="mt-1"><VscTriangleLeft className="bg-blue-600 p-1 rounded text-white text-2xl"/></button>
                        </div>}
                        <div className="mt-1 flex justify-center"><button type="button" onClick={() => handleTaskClick(task._id)}>{task.name}</button></div>
                        {(currentUserIsExecutorOrOwner(task) || rights?.check) && <div className="flex justify-end">
                            <button onClick={() => handleMove(task._id, 2)}><VscTriangleRight className="bg-blue-600 p-1 rounded text-white text-2xl"/></button>
                        </div>}
                    </div>
                })}
            </div>
            <div className="bg-gray-100 rounded p-4 flex flex-col gap-2">
                <div className="text-gray-600 font-bold">Виконано:</div>
                {tasks.map((task: Task) => {
                    if((!isFiltered || currentUserIsExecutorOrOwner(task)) && task.status === "done") return <div className="grid grid-cols-3 bg-white rounded py-2 px-4 border">
                        {(currentUserIsExecutorOrOwner(task) || rights?.check) && <div>
                            <button onClick={() => handleMove(task._id, 1)} className="mt-1"><VscTriangleLeft className="bg-blue-600 p-1 rounded text-white text-2xl"/></button>
                        </div>}
                        <div className="flex justify-center mt-1"><button type="button" onClick={() => handleTaskClick(task._id)}>{task.name}</button></div>
                    </div>
                })}
            </div>
        </div>
        <div className="flex gap-2 justify-end pr-4">
            <input type="checkbox" checked={isFiltered} onChange={() => setIsFiltered(!isFiltered)}/>
            <label>тільки задачі, назначені вам</label>
        </div>
    </div>
    else return <LoadingScreen/>
}

export default BoardWindow;