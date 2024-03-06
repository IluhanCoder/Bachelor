import { useEffect, useState } from "react";
import Task, { TaskResponse } from "./task-types";
import taskService from "./task-service";
import { useParams } from "react-router-dom";
import userStore from "../user/user-store";
import { UserResponse } from "../user/user-types";


function BoardWindow() {
    const {projectId} = useParams();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [isFiltered, setIsFiltered] = useState<boolean>(false);

    const getData = async () => {
        if(projectId) {
            const result = await taskService.getProjectTasks(projectId);
            console.log(result);
            setTasks([...result.tasks]);
        }
    }

    const handleMove = async (taskId: string, statusIndex: number) => {
        await taskService.setStatus(taskId, statusIndex);
        getData();
    }

    useEffect(() => { getData() }, [projectId]);

    return <div>
        <div>
            <input type="checkbox" checked={isFiltered} onChange={() => setIsFiltered(!isFiltered)}/>
            <label>тільки завдання, назначені вам</label>
        </div>
        <div className="w-full grid grid-cols-3 gap-4">
            <div className="bg-gray-100 rounded p-4">
                <div>Треба зробити:</div>
                {tasks.map((task: Task) => {
                    if((!isFiltered || task.executors.find((executor: string) => executor === userStore.user?._id)) &&  task.status === "toDo") return <div>
                        <div>{task.name}</div>
                        <div>
                            <button onClick={() => handleMove(task._id, 1)}>{"=>"}</button>
                        </div>
                    </div>
                })}
            </div>
            <div className="bg-gray-100 rounded p-4">
                <div>В процесі:</div>
                {tasks.map((task) => {
                    if((!isFiltered || task.executors.find((executor: string) => {console.log(executor); return executor === userStore.user?._id})) && task.status === "inProgress") return <div>
                        <div>
                            <button onClick={() => handleMove(task._id, 0)}>{"<="}</button>
                        </div>
                        <div>{task.name}</div>
                        <div>
                            <button onClick={() => handleMove(task._id, 2)}>{"=>"}</button>
                        </div>
                    </div>
                })}
            </div>
            <div className="bg-gray-100 rounded p-4">
                <div>Виконано</div>
                {tasks.map((task: Task) => {
                    if((!isFiltered || task.executors.find((executor: string) => executor === userStore.user?._id)) && task.status === "done") return <div>
                        <div>
                            <button onClick={() => handleMove(task._id, 1)}>{"<="}</button>
                        </div>
                        <div>{task.name}</div>
                    </div>
                })}
            </div>
        </div>
    </div>
}

export default BoardWindow;