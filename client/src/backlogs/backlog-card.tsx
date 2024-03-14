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
import TaskInfoForm from "../task/task-info-form";
import LoadingScreen from "../misc/loading-screen";

interface LocalParams {
    backlog: BacklogResponse
}

function BacklogCard({backlog}: LocalParams) {
    const [tasks, setTasks] = useState<TaskResponse[] | null>(null);
    const [sprints, setSprints] = useState<SprintResponse[] | null>(null);

    const getData = async () => {
        const tasksResponse = await taskService.getBacklogTasks(backlog._id);
        const sprintsResponse = await sprintService.getSprints(backlog._id);
        setTasks([...tasksResponse.tasks]);
        setSprints([...sprintsResponse.sprints]);
    }

    const handlePush = async (task: TaskResponse) => {
        if(sprints) formStore.setForm(<PushTaskForm sprints={sprints} task={task} callBack={() => {getData()}}/>)
    }

    const handlePull = async (taskId: string, sprintId: string) => {
        await sprintService.pullTask(taskId, sprintId);
        getData();
    }

    const handleDeleteTask = async (taskId: string) => {
        await taskService.deleteTask(taskId);
        getData();
    }

    const handleNewTask = () => {
        formStore.setForm(<NewTaskForm backlogId={backlog._id} callBack={() => {getData()}}/>)
    }

    const handleNewSprint = () => [
        formStore.setForm(<NewSprintForm backlogId={backlog._id} callBack={() => {getData()}}/>)
    ]

    const handleAssing = (task: TaskResponse) => {
        formStore.setForm(<AssignForm task={task} projectId={backlog.projectId} callBack={getData}/>)
    }

    const detailsHandler = (taskId: string) => {
        formStore.setForm(<TaskInfoForm callBack={() => getData()} taskId={taskId}/>)
    }

    useEffect(() => {getData()}, []);

    return <div className="border border-1 rounded">
        <div className="text-2xl px-4 py-2">{backlog.name}</div>
        {tasks && <div className="flex flex-col px-6 pb-4 gap-2">
            <div className="font-bold text-gray-600">Завдання беклогу:</div>
            <BacklogTasksMapper detailsHandler={detailsHandler} deleteHandler={handleDeleteTask} tasks={tasks} pushHandler={handlePush} assignHandler={handleAssing}/>
            <div className="flex pb-4 px-6 justify-center">
                <button className={submitButtonStyle} type="button" onClick={handleNewTask}>Створити завдання</button>
            </div>
        </div> || <LoadingScreen/>}
        {sprints && <div className="flex flex-col px-6 pb-4 gap-2">
            <div className="font-bold text-gray-600">Спрінти:</div>
            <BacklogSprintsMapper deleteHandler={handleDeleteTask} callBack={getData} pullHandler={handlePull} sprints={sprints} assignHandler={handleAssing}/>
            <div className="flex pb-4 px-6 justify-center">
                <button className={submitButtonStyle} type="button" onClick={handleNewSprint}>Створити спрінт</button>
            </div>
        </div> || <LoadingScreen/>}
    </div>
}

export default BacklogCard;