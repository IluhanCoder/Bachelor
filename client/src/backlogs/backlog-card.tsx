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
import NewSprintForm from "../sprint/new-sprint-form";
import AssignForm from "../task/assign-form";

interface LocalParams {
    backlog: BacklogResponse
}

function BacklogCard({backlog}: LocalParams) {
    const [tasks, setTasks] = useState<TaskResponse[]>([]);
    const [sprints, setSprints] = useState<SprintResponse[]>([]);

    const getData = async () => {
        const tasksResponse = await taskService.getBacklogTasks(backlog._id);
        const sprintsResponse = await sprintService.getSprints(backlog._id);
        console.log(tasksResponse);
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

    const handleNewSprint = () => [
        formStore.setForm(<NewSprintForm backlogId={backlog._id} callBack={() => {getData()}}/>)
    ]

    const handleAssing = (task: TaskResponse) => {
        formStore.setForm(<AssignForm task={task} projectId={backlog.projectId}/>)
    }

    useEffect(() => {getData()}, []);

    return <div>
        <div>{backlog.name}</div>
        <BacklogTasksMapper tasks={tasks} pushHandler={handlePush} assignHandler={handleAssing}/>
        <div>
            <button className={submitButtonStyle} type="button" onClick={handleNewTask}>Створити завдання</button>
        </div>
        <BacklogSprintsMapper pullHandler={handlePull} sprints={sprints}/>
        <div>
            <button className={submitButtonStyle} type="button" onClick={handleNewSprint}>створити спрінт</button>
        </div>
    </div>
}

export default BacklogCard;