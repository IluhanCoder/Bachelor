import { useEffect, useState } from "react";
import { TaskResponse } from "./task-types";
import taskService from "./task-service";
import TasksMapper from "./tasks-mapper";
import { SprintResponse } from "../sprint/sprint-types";

interface LocalParams {
    sprint: SprintResponse,
    pullHandler: (taskId: string) => {}
}

function SprintTasksMapper ({sprint, pullHandler}: LocalParams) {
    const [tasks, setTasks] = useState<TaskResponse[]>([]);

    const getTasks = async () => {
        const result = await taskService.getSprintTasks(sprint._id);
        setTasks([...result.tasks]);
    }

    useEffect(() => { getTasks() }, [sprint]);

    return <div>
        {tasks.map((task: TaskResponse) => <div className="bg-gray-200 m-4">
            <div>{task.name}</div>
            <div>
                <button type="button" onClick={() => pullHandler(task._id)}>прибрати</button>
            </div>
        </div>)}
    </div>
}

export default SprintTasksMapper;