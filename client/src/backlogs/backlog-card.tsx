import { useEffect, useState } from "react";
import { TaskResponse } from "../task/task-types";
import { SprintResponse } from "../sprint/sprint-types";
import { BacklogResponse } from "./backlog-types";
import taskService from "../task/task-service";
import sprintService from "../sprint/sprint-service";
import formStore from "../forms/form-store";
import PushTaskForm from "../sprint/push-task-form";
import BacklogTasksMapper from "../task/backlog-tasks-mapper";
import BacklogSprintsMapper from "../sprint/backlog-sprints-mapper";
import { submitButtonStyle } from "../styles/button-syles";
import NewTaskForm from "../task/new-task-form";

interface LocalParams {
    backlog: BacklogResponse
}

function BacklogCard({backlog}: LocalParams) {
    const [tasks, setTasks] = useState<TaskResponse[]>([]);
    const [sprints, setSprints] = useState<SprintResponse[]>([]);

    const getData = async () => {
        const tasksResponse = await taskService.getBacklogTasks(backlog._id);
        const sprintsResponse = await sprintService.getSprints(backlog._id);
        console.log("sprints:");
        console.log(sprintsResponse);
        setTasks([...tasksResponse.tasks]);
        setSprints([...sprintsResponse.sprints]);
    }

    const handlePush = async (task: TaskResponse) => {
        formStore.setForm(<PushTaskForm sprints={sprints} task={task} callBack={() => {getData()}}/>)
    }

    const handlePull = async (taskId: string, sprintId: string) => {
        await sprintService.pullTask(taskId, sprintId);
        getData();
    }

    const handleNewTask = () => {
        formStore.setForm(<NewTaskForm backlogId={backlog._id} callBack={() => {getData()}}/>)
    }

    useEffect(() => {getData()}, []);

    return <div>
        <div>{backlog.name}</div>
        <BacklogTasksMapper tasks={tasks} pushHandler={handlePush}/>
        <div>
            <button className={submitButtonStyle} type="button" onClick={handleNewTask}>Створити завдання</button>
        </div>
        <BacklogSprintsMapper pullHandler={handlePull} sprints={sprints}/>
    </div>
}

export default BacklogCard;