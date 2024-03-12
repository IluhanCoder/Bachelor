import { useEffect, useState } from "react";
import { TasksAnalyticsResponse } from "./analytics-types";
import analyticsService from "./analytics-service";
import { useParams } from "react-router-dom";
import { UserResponse } from "../user/user-types";
import UsersMapper from "../user/users-mapper";
import userStore from "../user/user-store";
import { observer } from "mobx-react";
import AnalyticsGraph from "./graph";
import { convertArray } from "./analytics-helper";
import DatePicker from "./date-picker";

function AnalyticsPage () {
    const {projectId} = useParams();

    const [taskAmountData, setTasksAmountData] = useState<TasksAnalyticsResponse[]>([]);
    const [tasksRatioData, setTasksRatioData] = useState<TasksAnalyticsResponse[]>([]);
    const [createdTaskData, setCreatedTaskData] = useState<TasksAnalyticsResponse[]>([]);
    const [prediction, setPrediction] = useState<TasksAnalyticsResponse[]>([]);

    const [isCurrentUser, setIsCurrentUser] = useState<boolean>(false);
    const [isDaily, setIsDaily] = useState<boolean>(false);

    const [startDate, setStartDate] = useState<Date>(new Date(2024, 0, 1));
    const [endDate, setEndDate] = useState<Date>(new Date(2024, 11, 1));

    const handleStart = (date: Date) => {
        if (date >= endDate) return;
        setStartDate(date);
    }

    const handleEnd = (date: Date) => {
        if (date <= startDate) return;
        setEndDate(date);
    }

    const getTasksAmoutAnalytics = async () => {
        if(projectId && userStore.user?._id) { 
            const result = await analyticsService.taskAmount(projectId, startDate, endDate, isDaily, (isCurrentUser) ? userStore.user?._id : undefined);
            setTasksAmountData([...result.result]);
        }
    }   

    const getTasksRatioData = async () => {
        if(projectId && userStore.user?._id) {
            const result = await analyticsService.taskRatio(projectId, startDate, endDate, isDaily, (isCurrentUser) ? userStore.user?._id : undefined);
            setTasksRatioData([...result.result]);
        }
    }

    const getCreatedTaskData = async () => {
        if(projectId && userStore.user?._id) {
            const result = await analyticsService.createdTaskAmount(projectId, startDate, endDate, isDaily, (isCurrentUser) ? userStore.user?._id : undefined);
            setCreatedTaskData([...result.result]);
        }
    }

    const getPrediction = async () => {
        if(projectId && userStore.user?._id) {
            const result = await analyticsService.predictRatio(projectId, (isCurrentUser) ? userStore.user?._id : undefined);
            setPrediction([...result.result]);
        }
    }

    useEffect(() => { getTasksAmoutAnalytics(); getTasksRatioData(); getCreatedTaskData(); getPrediction() }, [userStore.user?._id, isDaily, isCurrentUser, startDate, endDate]);

    return <div>
        <DatePicker startDate={startDate} endDate={endDate} handleStart={handleStart} handleEnd={handleEnd}/>
        <div>
            <input type="checkBox" checked={isDaily} onChange={() => setIsDaily(!isDaily)}/>
            <input type="checkBox" checked={isCurrentUser} onChange={() => setIsCurrentUser(!isCurrentUser)}/>
        </div>
        <AnalyticsGraph data={convertArray(createdTaskData)} name="test"/>
        <AnalyticsGraph data={convertArray(taskAmountData)} name="test"/>
        <AnalyticsGraph data={convertArray(tasksRatioData)} name="test"/>
        <AnalyticsGraph data={convertArray(prediction)} name="test"/>
    </div>
}

export default observer(AnalyticsPage);