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
import { Rights } from "../project/project-types";

interface LocalParams {
    backlog: BacklogResponse,
    rights: Rights
}

function BacklogCard({backlog, rights}: LocalParams) {
    const [tasks, setTasks] = useState<TaskResponse[] | null>(null);
    const [sprints, setSprints] = useState<SprintResponse[] | null>(null);

    const getData = async () => {
        const tasksResponse = await taskService.getBacklogTasks(backlog._id);
        const sprintsResponse = await sprintService.getSprints(backlog._id);
        setTasks([...tasksResponse.tasks]);
        setSprints([...sprintsResponse.sprints]);
    }

    // Story Points calculation
    const getStoryPoints = (difficulty: string): number => {
        const pointsMap: { [key: string]: number } = {
            low: 1,
            mid: 3,
            high: 5,
            hight: 5  // Fallback for old typo
        };
        return pointsMap[difficulty] || 0;
    }

    const calculateBacklogPoints = (): number => {
        if (!tasks) return 0;
        return tasks.reduce((sum, task) => sum + getStoryPoints(task.difficulty), 0);
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
        formStore.setForm(<TaskInfoForm rights={rights} projectId={backlog.projectId} callBack={() => getData()} taskId={taskId}/>)
    }

    useEffect(() => {getData()}, []);

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {/* Backlog Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">{backlog.name}</h3>
                    {tasks && (
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <div className="text-2xl font-bold text-blue-600">
                                    {calculateBacklogPoints()}
                                </div>
                                <div className="text-xs text-gray-500 font-medium">
                                    Story Points
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Tasks Section */}
            {tasks && (
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                            Backlog Tasks
                        </h4>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                            {tasks.length}
                        </span>
                    </div>
                    <div className="space-y-2">
                        <BacklogTasksMapper 
                            rights={rights} 
                            detailsHandler={detailsHandler} 
                            deleteHandler={handleDeleteTask} 
                            tasks={tasks} 
                            pushHandler={handlePush} 
                            assignHandler={handleAssing}
                        />
                    </div>
                    {rights.create && (
                        <button 
                            className="mt-4 w-full px-4 py-2.5 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                            type="button" 
                            onClick={handleNewTask}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create Task
                        </button>
                    )}
                </div>
            )}

            {/* Sprints Section */}
            {sprints && (
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                            Sprints
                        </h4>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                            {sprints.length}
                        </span>
                    </div>
                    <div className="space-y-3">
                        <BacklogSprintsMapper 
                            rights={rights} 
                            detailsHandler={detailsHandler} 
                            deleteHandler={handleDeleteTask} 
                            callBack={getData} 
                            pullHandler={handlePull} 
                            sprints={sprints} 
                            assignHandler={handleAssing}
                        />
                    </div>
                    {rights.manageSprints && (
                        <button 
                            className="mt-4 w-full px-4 py-2.5 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                            type="button" 
                            onClick={handleNewSprint}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create Sprint
                        </button>
                    )}
                </div>
            )}

            {(!tasks || !sprints) && <LoadingScreen/>}
        </div>
    );
}

export default BacklogCard;