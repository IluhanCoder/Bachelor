import { useEffect, useState } from "react";
import { TaskResponse } from "./task-types";
import taskService from "./task-service";
import TasksMapper from "./tasks-mapper";

interface LocalParams {
    sprintId: string,
    onPull?: () => {}
}

function SprintTasksMapper ({sprintId, onPull}: LocalParams) {
    const [tasks, setTasks] = useState<TaskResponse[]>([]);

    const getTasks = async () => {
        const result = await taskService.getSprintTasks(sprintId);
        setTasks([...result.tasks]);
    }

    useEffect(() => { getTasks() }, []);

    return <TasksMapper onPull={onPull} sprintId={sprintId} push={false} tasks={tasks} onCheck={getTasks}/>
}

export default SprintTasksMapper;