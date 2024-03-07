import { useEffect, useState } from "react";
import { TasksAnalyticsResponse } from "./analytics-types";
import analyticsService from "./analytics-service";
import { useParams } from "react-router-dom";

function AnalyticsPage () {
    const {projectId} = useParams();

    const [data, setData] = useState<TasksAnalyticsResponse[]>([]);

    const getTasksAmoutAnalytics = async () => {
        if(projectId) { 
            const result = await analyticsService.taskAmount(projectId, new Date(2024, 2, 1), new Date(2024, 3, 30), false); 
            console.log(result);
        }
    }   

    useEffect(() => { getTasksAmoutAnalytics() }, []);

    return <div></div>
}

export default AnalyticsPage