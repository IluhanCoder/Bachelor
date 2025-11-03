import { useEffect, useState } from "react";
import { SprintResponse } from "./sprint-types";
import sprintService from "./sprint-service";
import { TaskResponse } from "../task/task-types";
import SprintTasksMapper from "../task/sprint-tasks-mapper";
import formStore from "../forms/form-store";
import EditSprintForm from "./edit-sprint-form";
import { lightButtonStyle, redButtonSyle, submitButtonStyle } from "../styles/button-syles";
import { Rights } from "../project/project-types";

interface LocalParams {
    sprints: SprintResponse[],
    pullHandler: (taskId: string, sprintId: string) => {},
    assignHandler: (task: TaskResponse) => void,
    deleteHandler: (taskId: string) => void,
    detailsHandler: (taskId: string) => void,
    callBack?: () => {},
    rights: Rights
}

function BacklogSprintsMapper({sprints, pullHandler, assignHandler, callBack, deleteHandler, detailsHandler, rights}: LocalParams) {
    const handleEdit = (sprintId: string) => {
        formStore.setForm(<EditSprintForm sprintId={sprintId} callBack={callBack}/>);
    }

    const handleDelete = async (sprintId: string) => {
        await sprintService.deleteSprint(sprintId);
        if(callBack) callBack();
    }

    const isTerminated = (sprint: SprintResponse) => {
        return new Date() > new Date(sprint.endDate);
    }

    // Calculate Story Points based on difficulty
    const getStoryPoints = (difficulty: string): number => {
        const pointsMap: { [key: string]: number } = {
            low: 1,
            mid: 3,
            high: 5,
            hight: 5  // Fallback for old typo
        };
        return pointsMap[difficulty] || 0;
    }

    const calculateTotalPoints = (tasks: TaskResponse[]): number => {
        return tasks
            .filter(task => task && task._id)  // Filter out empty/undefined tasks
            .reduce((sum, task) => sum + getStoryPoints(task.difficulty), 0);
    }

    const calculateCompletedPoints = (tasks: TaskResponse[]): number => {
        return tasks
            .filter(task => task && task._id && task.status === 'done')
            .reduce((sum, task) => sum + getStoryPoints(task.difficulty), 0);
    }
    
    if (sprints.length === 0) {
        return (
            <div className="text-center py-8">
                <svg className="mx-auto w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p className="text-gray-500 font-medium">No sprints available</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {sprints.map((sprint: SprintResponse) => {
                const totalPoints = calculateTotalPoints(sprint.tasks);
                const completedPoints = calculateCompletedPoints(sprint.tasks);
                const progressPercentage = totalPoints > 0 ? (completedPoints / totalPoints) * 100 : 0;

                return (
                    <div 
                        key={sprint._id}
                        className={`border rounded-lg overflow-hidden ${
                            isTerminated(sprint) 
                                ? "border-red-300 bg-red-50/30" 
                                : "border-gray-200 bg-white"
                        }`}
                    >
                        {/* Sprint Header */}
                        <div className={`px-4 py-3 border-b ${
                            isTerminated(sprint) 
                                ? "bg-red-100/50 border-red-200" 
                                : "bg-gray-50 border-gray-200"
                        }`}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <h5 className="font-semibold text-gray-900">{sprint.name}</h5>
                                    {isTerminated(sprint) && (
                                        <span className="px-2 py-0.5 text-xs font-medium text-red-700 bg-red-100 rounded-full">
                                            Completed
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    {rights.manageSprints && (
                                        <button 
                                            type="button" 
                                            onClick={() => handleEdit(sprint._id)} 
                                            className="px-2.5 py-1.5 text-base text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                            title="Edit"
                                        >
                                            ✏️
                                        </button>
                                    )}
                                    {rights.manageSprints && (
                                        <button 
                                            type="button" 
                                            onClick={() => handleDelete(sprint._id)} 
                                            className="px-2.5 py-1.5 text-base text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
                                            title="Delete"
                                        >
                                            🗑️
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Story Points Progress */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 font-medium">Story Points</span>
                                    <span className="font-semibold text-gray-900">
                                        {completedPoints} / {totalPoints} SP
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 rounded-full"
                                        style={{ width: `${progressPercentage}%` }}
                                    />
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>{sprint.tasks.length} задач</span>
                                    <span>{progressPercentage.toFixed(0)}% виконано</span>
                                </div>
                            </div>
                        </div>

                        {/* Sprint Tasks */}
                        <div className="p-4">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                                Задачі спрінту
                            </div>
                            <SprintTasksMapper 
                                rights={rights} 
                                detailsHandler={detailsHandler} 
                                assignHandler={assignHandler} 
                                deleteHandler={deleteHandler} 
                                pullHandler={(taskId: string) => pullHandler(taskId, sprint._id)} 
                                sprint={sprint}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default BacklogSprintsMapper;