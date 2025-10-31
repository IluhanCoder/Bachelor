import { useEffect, useState } from "react";
import { TaskResponse } from "./task-types";
import taskService from "./task-service";
import TasksMapper from "./tasks-mapper";
import formStore from "../forms/form-store";
import AssignForm from "./assign-form";
import { UserResponse } from "../user/user-types";
import { lightButtonStyle, redButtonSyle } from "../styles/button-syles";
import TaskInfoForm from "./task-info-form";
import TaskStatusDisplayer from "./task-status-diplayer";
import { Rights } from "../project/project-types";
import TaskPriorityDisplayer from "./task-priority-displayer";
import userStore from "../user/user-store";

interface LocalParams {
    tasks: TaskResponse[],
    assignHandler: (task: TaskResponse) => void,
    pushHandler: (task: TaskResponse) => void,
    deleteHandler: (taskId: string) => void,
    detailsHandler: (taskId: string) => void,
    rights: Rights
}

function BacklogTasksMapper ({tasks, pushHandler, assignHandler, deleteHandler, detailsHandler, rights}: LocalParams) {
    // Filter out tasks without name
    const validTasks = tasks.filter(task => task && task.name);
    
    // Helper function to check if user is creator of the task
    const isCreator = (task: TaskResponse) => {
        if (!userStore.user || !task.createdBy) return false;
        const createdById = typeof task.createdBy === 'string' 
            ? task.createdBy 
            : (task.createdBy as any)._id || (task.createdBy as any).toString();
        return createdById === userStore.user._id;
    };
    
    if(validTasks && validTasks.length > 0) return (
        <div className="space-y-2">
            {validTasks.map((task: TaskResponse) => {
                const isOwnTask = isCreator(task);
                const canPush = rights.edit || (isOwnTask && rights.create);
                const canDelete = rights.delete || (isOwnTask && rights.create);
                
                return (
                <div 
                    key={task._id}
                    className="group bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-4 transition-all"
                >
                    <div className="flex items-center justify-between gap-4">
                        {/* Task Name */}
                        <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-gray-900 truncate">{task.name}</h5>
                        </div>

                        {/* Status Badge */}
                        <div className="flex-shrink-0">
                            <TaskStatusDisplayer status={task.status}/>
                        </div>

                        {/* Priority Badge */}
                        <div className="flex-shrink-0">
                            <TaskPriorityDisplayer priority={task.priority}/>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 flex-shrink-0">
                            <button 
                                type="button" 
                                className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                onClick={() => detailsHandler(task._id)}
                            >
                                Details
                            </button>
                            {canPush && (
                                <button 
                                    type="button" 
                                    className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                                    onClick={() => pushHandler(task)}
                                >
                                    To Sprint
                                </button>
                            )}
                            {canDelete && (
                                <button 
                                    type="button" 
                                    className="px-2.5 py-1.5 text-base text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
                                    onClick={() => deleteHandler(task._id)}
                                    title="Delete"
                                >
                                    🗑️
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )})}
        </div>
    );
    else return (
        <div className="text-center py-8">
            <svg className="mx-auto w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500 font-medium">No tasks available</p>
        </div>
    );
}

export default BacklogTasksMapper;