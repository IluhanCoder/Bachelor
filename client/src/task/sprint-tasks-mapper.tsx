import { useEffect, useState } from "react";
import { TaskResponse } from "./task-types";
import taskService from "./task-service";
import TasksMapper from "./tasks-mapper";
import { SprintResponse } from "../sprint/sprint-types";
import { UserResponse } from "../user/user-types";

interface LocalParams {
    sprint: SprintResponse,
    pullHandler: (taskId: string) => {},
    assignHandler: (task: TaskResponse) => void,
}

function SprintTasksMapper ({sprint, pullHandler, assignHandler}: LocalParams) {
    const [tasks, setTasks] = useState<TaskResponse[]>([]);

    const getTasks = async () => {
        const result = await taskService.getSprintTasks(sprint._id);
        console.log(result);
        setTasks([...result.tasks]);
    }

    useEffect(() => { getTasks() }, [sprint]);

    return <div>{tasks.map((task: TaskResponse) => task.name && <div className="bg-gray-200 m-4">
            <div>{task.name}</div>
            <div>{task.executors.map((executor: UserResponse) => <div>{executor.nickname}</div>)}</div>
            <div className="flex gap-2">
                <button type="button" onClick={() => pullHandler(task._id)}>прибрати</button>
                <button type="button" onClick={() => assignHandler(task)}>назначити</button>
            </div>
        </div>
    )}</div>
}

export default SprintTasksMapper;