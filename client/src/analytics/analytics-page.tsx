import { useEffect, useState } from "react";
import { TasksAnalyticsResponse, QuickStatsResponse, VelocityDataPoint, TopContributor } from "./analytics-types";
import analyticsService from "./analytics-service";
import { useParams } from "react-router-dom";
import { UserResponse } from "../user/user-types";
import UsersMapper from "../user/users-mapper";
import userStore from "../user/user-store";
import { observer } from "mobx-react";
import AnalyticsGraph from "./graph";
import { convertArray } from "./analytics-helper";
import DatePicker from "./date-picker";
import { Link } from "react-router-dom";
import { lightButtonStyle } from "../styles/button-syles";
import QuickStatsCards from "./quick-stats-cards";
import VelocityChart from "./velocity-chart";
import TopContributorsTable from "./top-contributors-table";

function AnalyticsPage () {
    const {projectId} = useParams();

    const [taskAmountData, setTasksAmountData] = useState<TasksAnalyticsResponse[]>([]);
    const [tasksRatioData, setTasksRatioData] = useState<TasksAnalyticsResponse[]>([]);
    const [createdTaskData, setCreatedTaskData] = useState<TasksAnalyticsResponse[]>([]);
    const [prediction, setPrediction] = useState<TasksAnalyticsResponse[]>([]);
    
    // New analytics data
    const [quickStats, setQuickStats] = useState<QuickStatsResponse | null>(null);
    const [velocityData, setVelocityData] = useState<VelocityDataPoint[]>([]);
    const [topContributors, setTopContributors] = useState<TopContributor[]>([]);

    const [isCurrentUser, setIsCurrentUser] = useState<boolean>(false);
    const [isDaily, setIsDaily] = useState<boolean>(false);

    // Default: last 30 days to today
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const [startDate, setStartDate] = useState<Date>(thirtyDaysAgo);
    const [endDate, setEndDate] = useState<Date>(today);

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

    const getQuickStats = async () => {
        if(projectId && userStore.user?._id) {
            const result = await analyticsService.getQuickStats(projectId, (isCurrentUser) ? userStore.user?._id : undefined);
            setQuickStats(result.result);
        }
    }

    const getVelocityData = async () => {
        if(projectId) {
            const result = await analyticsService.getVelocityData(projectId);
            setVelocityData(result.result);
        }
    }

    const getTopContributors = async () => {
        if(projectId) {
            const result = await analyticsService.getTopContributors(projectId);
            setTopContributors(result.result);
        }
    }

    useEffect(() => { 
        getTasksAmoutAnalytics(); 
        getTasksRatioData(); 
        getCreatedTaskData(); 
        getPrediction();
        getQuickStats();
        getVelocityData();
        getTopContributors();
    }, [userStore.user?._id, isDaily, isCurrentUser, startDate, endDate]);

    return <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                        <span>📊</span>
                        Project Analytics
                    </h1>
                    <p className="text-gray-600">Detailed statistics and performance metrics</p>
                </div>
                <Link to={`/project/${projectId}`} className={lightButtonStyle}>
                    ← Back to Project
                </Link>
            </div>

            {/* Quick Stats Cards */}
            <QuickStatsCards stats={quickStats} />

            {/* Velocity Chart */}
            <VelocityChart data={velocityData} />

            {/* Top Contributors */}
            <TopContributorsTable contributors={topContributors} />

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span>⚙️</span>
                    Chart Settings
                </h3>
                <div className="flex flex-wrap gap-6 mb-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={isDaily} 
                            onChange={() => setIsDaily(!isDaily)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">Daily Statistics</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={isCurrentUser} 
                            onChange={() => setIsCurrentUser(!isCurrentUser)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">My Tasks Only</span>
                    </label>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                    <DatePicker 
                        className="flex gap-6" 
                        startDate={startDate} 
                        endDate={endDate} 
                        handleStart={handleStart} 
                        handleEnd={handleEnd}
                    />
                </div>
            </div>

            {/* Original Charts */}
            <div className="space-y-8">
                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">📈</span>
                            <h3 className="text-2xl font-bold text-gray-800">
                                Created Tasks Count
                            </h3>
                        </div>
                        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold">
                            Total: {createdTaskData.reduce((sum, item) => sum + item.amount, 0)}
                        </div>
                    </div>
                    <AnalyticsGraph 
                        data={convertArray(createdTaskData)} 
                        name="count"
                        color="#10b981"
                        type="area"
                    />
                    <div className="mt-4 text-sm text-gray-600 text-center">
                        Shows how many new tasks were created in the selected period
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">✅</span>
                            <h3 className="text-2xl font-bold text-gray-800">
                                Task Completion
                            </h3>
                        </div>
                        <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold">
                            Total: {taskAmountData.reduce((sum, item) => sum + item.amount, 0)}
                        </div>
                    </div>
                    <AnalyticsGraph 
                        data={convertArray(taskAmountData)} 
                        name="count"
                        color="#3b82f6"
                        type="area"
                    />
                    <div className="mt-4 text-sm text-gray-600 text-center">
                        Shows how many tasks were completed (marked as done) in the selected period
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">📊</span>
                            <h3 className="text-2xl font-bold text-gray-800">
                                Completed vs Incomplete Tasks Ratio
                            </h3>
                        </div>
                        <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-semibold">
                            Average: {Math.round(tasksRatioData.reduce((sum, item) => sum + item.amount, 0) / Math.max(tasksRatioData.length, 1))}%
                        </div>
                    </div>
                    <AnalyticsGraph 
                        data={convertArray(tasksRatioData)} 
                        name="%"
                        color="#8b5cf6"
                        type="area"
                    />
                    <div className="mt-4 text-sm text-gray-600 text-center">
                        Percentage of completed tasks out of total created at the time
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">🔮</span>
                            <h3 className="text-2xl font-bold text-gray-800">
                                Efficiency Forecast (Linear Regression)
                            </h3>
                        </div>
                        <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg font-semibold">
                            Trend: {prediction.length > 1 && prediction[prediction.length - 1].amount > prediction[0].amount ? '📈 Growing' : '📉 Declining'}
                        </div>
                    </div>
                    <AnalyticsGraph 
                        data={convertArray(prediction)} 
                        name="%"
                        color="#f59e0b"
                        type="line"
                    />
                    <div className="mt-4 text-sm text-gray-600 text-center">
                        Team efficiency forecasting based on historical data
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default observer(AnalyticsPage);