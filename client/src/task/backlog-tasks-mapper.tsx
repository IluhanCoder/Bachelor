import { useEffect, useState } from "react";
import { TaskResponse } from "./task-types";
import taskService from "./task-service";
import TasksMapper from "./tasks-mapper";

interface LocalParams {
    backlogId: string
}

function BacklogTasksMapper ({backlogId}: LocalParams) {
    const [tasks, setTasks] = useState<TaskResponse[]>([]);

    const getTasks = async () => {
        const result = await taskService.getBacklogTasks(backlogId);
        setTasks([...result.tasks]);
    }

    useEffect(() => { getTasks() }, []);

    return <TasksMapper tasks={tasks} onCheck={getTasks}/>
}

export default BacklogTasksMapper;