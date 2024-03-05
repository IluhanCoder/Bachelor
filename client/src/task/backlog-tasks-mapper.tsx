import { useEffect, useState } from "react";
import { TaskResponse } from "./task-types";
import taskService from "./task-service";
import TasksMapper from "./tasks-mapper";

interface LocalParams {
    backlogId: string
    onPush?: () => {}
}

function BacklogTasksMapper ({backlogId, onPush}: LocalParams) {
    const [tasks, setTasks] = useState<TaskResponse[]>([]);

    const getTasks = async () => {
        const result = await taskService.getBacklogTasks(backlogId);
        setTasks([...result.tasks]);
    }

    useEffect(() => { getTasks() }, []);

    return <TasksMapper onPush={onPush} push tasks={tasks} onCheck={getTasks}/>
}

export default BacklogTasksMapper;