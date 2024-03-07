import { useEffect, useState } from "react";
import { TasksAnalyticsResponse } from "./analytics-types";
import analyticsService from "./analytics-service";
import { useParams } from "react-router-dom";
import { UserResponse } from "../user/user-types";
import UsersMapper from "../user/users-mapper";
import userStore from "../user/user-store";
import { observer } from "mobx-react";

function AnalyticsPage () {
    const {projectId} = useParams();

    const [data, setData] = useState<TasksAnalyticsResponse[]>([]);
    const [isCurrentUser, setIsCurrentUser] = useState<boolean>(false);

    const getTasksAmoutAnalytics = async () => {
        if(projectId && userStore.user?._id) { 
            const result = await analyticsService.taskAmount(projectId, new Date(2024, 2, 1), new Date(2024, 3, 30), false, (isCurrentUser) ? userStore.user?._id : undefined); 
            console.log(result);
        }
    }   

    useEffect(() => { getTasksAmoutAnalytics() }, [userStore.user?._id]);

    return <div>

    </div>
}

export default observer(AnalyticsPage);