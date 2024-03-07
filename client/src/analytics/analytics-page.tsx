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

    const [data, setData] = useState<TasksAnalyticsResponse[]>([]);
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
            console.log(result);
            setData([...result.result]);
        }
    }   

    useEffect(() => { getTasksAmoutAnalytics() }, [userStore.user?._id, isDaily, startDate, endDate]);

    return <div>
        <DatePicker startDate={startDate} endDate={endDate} handleStart={handleStart} handleEnd={handleEnd}/>
        <div>
            <input type="checkBox" checked={isDaily} onChange={() => setIsDaily(!isDaily)}/>
        </div>
        <AnalyticsGraph data={convertArray(data)} name="test"/>
    </div>
}

export default observer(AnalyticsPage);