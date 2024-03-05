import { useEffect, useState } from "react";
import { TaskResponse } from "./task-types";
import taskService from "./task-service";
import TasksMapper from "./tasks-mapper";

interface LocalParams {
    sprintId: string
}

function SprintTasksMapper ({sprintId}: LocalParams) {
    const [tasks, setTasks] = useState<TaskResponse[]>([]);

    const getTasks = async () => {
        const result = await taskService.getSprintTasks(sprintId);
        setTasks([...result.tasks]);
    }

    useEffect(() => { getTasks() }, []);

    return <TasksMapper tasks={tasks} onCheck={getTasks}/>
}

export default SprintTasksMapper;