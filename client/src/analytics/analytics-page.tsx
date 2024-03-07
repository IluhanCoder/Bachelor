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

function AnalyticsPage () {
    const {projectId} = useParams();

    const [data, setData] = useState<TasksAnalyticsResponse[]>([]);
    const [isCurrentUser, setIsCurrentUser] = useState<boolean>(false);
    const [isDaily, setIsDaily] = useState<boolean>(false);

    const getTasksAmoutAnalytics = async () => {
        if(projectId && userStore.user?._id) { 
            const result = await analyticsService.taskAmount(projectId, new Date(2024, 1, 1), new Date(2024, 3, 30), isDaily, (isCurrentUser) ? userStore.user?._id : undefined);
            console.log(convertArray(data)); 
            setData([...result.result]);
        }
    }   

    useEffect(() => { getTasksAmoutAnalytics() }, [userStore.user?._id, isDaily]);

    return <div>
        <div>
            <input type="checkBox" checked={isDaily} onChange={() => setIsDaily(!isDaily)}/>
        </div>
        <AnalyticsGraph data={convertArray(data)} name="test"/>
    </div>
}

export default observer(AnalyticsPage);