import { useEffect, useState } from "react";
import { TaskResponse } from "./task-types";
import taskService from "./task-service";
import TasksMapper from "./tasks-mapper";
import { SprintResponse } from "../sprint/sprint-types";
import { UserResponse } from "../user/user-types";
import { lightButtonStyle, redButtonSyle } from "../styles/button-syles";

interface LocalParams {
    sprint: SprintResponse,
    pullHandler: (taskId: string) => {},
    assignHandler: (task: TaskResponse) => void,
    deleteHandler: (taskId: string) => void
}

function SprintTasksMapper ({sprint, pullHandler, assignHandler, deleteHandler}: LocalParams) {
    const [tasks, setTasks] = useState<TaskResponse[]>([]);

    const getTasks = async () => {
        const result = await taskService.getSprintTasks(sprint._id);
        setTasks([...result.tasks]);
    }

    useEffect(() => { getTasks() }, [sprint]);

    if(tasks[0] && tasks[0].name) return <div>{tasks.map((task: TaskResponse) => task.name && <div className="rounded py-2 pl-10 pr-4 gap-6 border-2 flex justify-between">
            <div className="text-xl font-bold mt-0.5">{task.name}</div>
            {task.executors.length > 0 && <div className="flex gap-2 mt-1">
                <div>призначено:</div>
                <div>{task.executors.map((executor: UserResponse) => <div>{executor.nickname}</div>)}</div>
            </div>}
            <div className="flex gap-2">
                <button type="button" className={lightButtonStyle} onClick={() => pullHandler(task._id)}>прибрати</button>
                <button type="button" className={lightButtonStyle} onClick={() => assignHandler(task)}>назначити</button>
                <button type="button" className={redButtonSyle} onClick={() => deleteHandler(task._id)}>видалити</button>
            </div>
        </div>
    )}</div>
    else return <div className="flex justify-center font-bold pb-10">Задачі відсутні</div>
}

export default SprintTasksMapper;