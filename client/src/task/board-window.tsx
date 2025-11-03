import { useEffect, useState } from "react";
import Task, { TaskResponse } from "./task-types";
import taskService from "./task-service";
import { useParams } from "react-router-dom";
import userStore from "../user/user-store";
import { UserResponse } from "../user/user-types";
import { Rights } from "../project/project-types";
import projectService from "../project/project-service";
import formStore from "../forms/form-store";
import TaskInfoForm from "./task-info-form";
import { Link } from "react-router-dom";
import LoadingScreen from "../misc/loading-screen";


function BoardWindow() {
    const {projectId} = useParams();

    const [tasks, setTasks] = useState<Task[] | null>(null);
    const [isFiltered, setIsFiltered] = useState<boolean>(false);
    const [rights, setRights] = useState<Rights>();
    const [ownerId, setOwnerId] = useState<string>();

    const getData = async () => {
        if(projectId) {
            const result = await taskService.getProjectTasks(projectId);
            setTasks([...result.tasks]);
            const ownerResult = await projectService.getOwnerId(projectId);
            setOwnerId(ownerResult.ownerId);
        }
    }

    const handleMove = async (taskId: string, statusIndex: number) => {
        await taskService.setStatus(taskId, statusIndex);
        getData();
    }

    const getUserRights = async () => {
        if(projectId) {
            const result = await projectService.getUserRights(projectId);
            setRights({...result.rights});
        }
    }

    const currentUserIsExecutorOrOwner = (task: Task) => {
        const executor = task.executors.find((executor: string) => executor === userStore.user?._id);
        return executor !== undefined || ownerId === userStore.user?._id
    }

    const handleTaskClick = (taskId: string) => {
        if(projectId && rights) formStore.setForm(<TaskInfoForm rights={rights} taskId={taskId} callBack={getData} projectId={projectId}/>)
    }

    useEffect(() => { getData(); getUserRights(); }, [projectId]);

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

    const calculateTotalPoints = (): number => {
        if (!tasks) return 0;
        return tasks.reduce((sum, task) => sum + getStoryPoints(task.difficulty), 0);
    }

    const calculatePointsByStatus = (status: string): number => {
        if (!tasks) return 0;
        return tasks
            .filter(task => task.status === status && (!isFiltered || currentUserIsExecutorOrOwner(task)))
            .reduce((sum, task) => sum + getStoryPoints(task.difficulty), 0);
    }

    const getPriorityColor = (priority: string) => {
        switch(priority) {
            case 'high': return 'bg-red-100 border-red-300 text-red-700';
            case 'mid': return 'bg-yellow-100 border-yellow-300 text-yellow-700';
            case 'low': return 'bg-green-100 border-green-300 text-green-700';
            default: return 'bg-gray-100 border-gray-300 text-gray-700';
        }
    }

    const getPriorityLabel = (priority: string) => {
        switch(priority) {
            case 'high': return 'High';
            case 'mid': return 'Medium';
            case 'low': return 'Low';
            default: return priority;
        }
    }

    const getDifficultyLabel = (difficulty: string) => {
        const pointsMap: { [key: string]: string } = {
            low: '1 SP',
            mid: '3 SP',
            high: '5 SP'
        };
        return pointsMap[difficulty] || difficulty;
    }

    const TaskCard = ({ task }: { task: Task }) => {
        const canMove = currentUserIsExecutorOrOwner(task) || rights?.check;
        const priorityColor = getPriorityColor(task.priority);
        
        return (
            <div className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-blue-300">
                <div className="p-4">
                    <button 
                        onClick={() => handleTaskClick(task._id)}
                        className="w-full text-left"
                    >
                        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {task.name}
                        </h3>
                        {task.desc && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {task.desc}
                            </p>
                        )}
                        
                        <div className="flex items-center gap-2 mb-3">
                            <span className={`text-xs px-2 py-1 rounded-full border ${priorityColor} font-medium`}>
                                {getPriorityLabel(task.priority)}
                            </span>
                            {task.difficulty && (
                                <span className="text-xs px-2 py-1 rounded-full bg-purple-100 border border-purple-300 text-purple-700 font-medium">
                                    {getDifficultyLabel(task.difficulty)}
                                </span>
                            )}
                        </div>

                        {task.executors && task.executors.length > 0 && (
                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex -space-x-2">
                                    {task.executors.slice(0, 3).map((executor: any, index: number) => (
                                        <div
                                            key={index}
                                            className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white flex items-center justify-center text-white text-xs font-semibold"
                                            title={executor.nickname || 'Executor'}
                                        >
                                            {executor.nickname ? executor.nickname[0].toUpperCase() : '?'}
                                        </div>
                                    ))}
                                    {task.executors.length > 3 && (
                                        <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-gray-700 text-xs font-semibold">
                                            +{task.executors.length - 3}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </button>

                    {canMove && task.status !== "done" && (
                        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                            {task.status === "inProgress" && (
                                <button
                                    onClick={() => handleMove(task._id, 0)}
                                    className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors flex items-center justify-center gap-1"
                                >
                                    ← Back
                                </button>
                            )}
                            <button
                                onClick={() => handleMove(task._id, task.status === "toDo" ? 1 : 2)}
                                className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center justify-center gap-1"
                            >
                                {task.status === "toDo" ? "Start →" : "Complete ✓"}
                            </button>
                        </div>
                    )}
                    {canMove && task.status === "done" && (
                        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                            <button
                                onClick={() => handleMove(task._id, 1)}
                                className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors flex items-center justify-center gap-1"
                            >
                                ← Повернути
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const Column = ({ title, status, color, icon }: { title: string; status: string; color: string; icon: string }) => {
        const filteredTasks = tasks?.filter((task: Task) => 
            task.status === status && (!isFiltered || currentUserIsExecutorOrOwner(task))
        ) || [];

        // Sort by priority: high -> mid -> low
        const sortedTasks = [...filteredTasks].sort((a, b) => {
            const priorityOrder: { [key: string]: number } = { high: 0, mid: 1, low: 2 };
            const priorityA = priorityOrder[a.priority] ?? 999;
            const priorityB = priorityOrder[b.priority] ?? 999;
            return priorityA - priorityB;
        });

        return (
            <div className="flex flex-col h-full">
                <div className={`${color} rounded-t-xl px-4 py-3 border-b-4`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">{icon}</span>
                            <h2 className="font-bold text-gray-800">{title}</h2>
                        </div>
                        <span className="bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-full text-sm font-semibold text-gray-700">
                            {filteredTasks.length}
                        </span>
                    </div>
                </div>
                <div className="flex-1 bg-gray-50 rounded-b-xl p-4 space-y-3 overflow-y-auto min-h-[500px] max-h-[calc(100vh-300px)]">
                    {sortedTasks.length === 0 ? (
                        <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                            No tasks
                        </div>
                    ) : (
                        sortedTasks.map((task: Task) => (
                            <TaskCard key={task._id} task={task} />
                        ))
                    )}
                </div>
            </div>
        );
    };

    if(tasks) return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link 
                            to={`/project/${projectId}`}
                            className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg shadow-sm border border-gray-200 transition-colors flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Project
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">📋 Task Board</h1>
                    </div>
                    
                    <label className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input 
                            type="checkbox" 
                            checked={isFiltered} 
                            onChange={() => setIsFiltered(!isFiltered)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">My Tasks Only</span>
                    </label>
                </div>

                {/* Story Points Statistics */}
                {tasks && tasks.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Total SP</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{calculateTotalPoints()}</p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                                    <span className="text-2xl">📊</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-blue-600 font-medium">To Do</p>
                                    <p className="text-2xl font-bold text-blue-700 mt-1">{calculatePointsByStatus('toDo')}</p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                                    <span className="text-2xl">📝</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-yellow-200 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-yellow-600 font-medium">In Progress</p>
                                    <p className="text-2xl font-bold text-yellow-700 mt-1">{calculatePointsByStatus('inProgress')}</p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center">
                                    <span className="text-2xl">⚡</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-green-200 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-green-600 font-medium">Completed</p>
                                    <p className="text-2xl font-bold text-green-700 mt-1">{calculatePointsByStatus('done')}</p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                                    <span className="text-2xl">✅</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Kanban Board */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Column 
                        title="To Do" 
                        status="toDo" 
                        color="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-500"
                        icon="📝"
                    />
                    <Column 
                        title="In Progress" 
                        status="inProgress" 
                        color="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-500"
                        icon="⚡"
                    />
                    <Column 
                        title="Completed" 
                        status="done" 
                        color="bg-gradient-to-r from-green-50 to-green-100 border-green-500"
                        icon="✅"
                    />
                </div>
            </div>
        </div>
    );
    else return <LoadingScreen/>
}

export default BoardWindow;