import { VelocityDataPoint } from "./analytics-types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface LocalParams {
    data: VelocityDataPoint[];
}

function VelocityChart({ data }: LocalParams) {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center text-gray-500">
                <span className="text-4xl mb-4 block">📊</span>
                Немає даних про спринти
            </div>
        );
    }

    const chartData = data.map(sprint => ({
        name: sprint.sprintName,
        'Всього SP': sprint.storyPoints,
        'Виконано SP': sprint.completedStoryPoints,
        rate: sprint.completionRate
    }));

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                    <p className="font-semibold text-gray-800 mb-2">{payload[0].payload.name}</p>
                    <p className="text-blue-600">Всього SP: {payload[0].payload['Всього SP']}</p>
                    <p className="text-green-600">Виконано SP: {payload[0].payload['Виконано SP']}</p>
                    <p className="text-purple-600 font-medium mt-1">
                        Завершено: {payload[0].payload.rate}%
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🚀</span>
                <h2 className="text-2xl font-bold text-gray-800">Velocity Chart</h2>
                <span className="text-sm text-gray-500 ml-auto">Story Points за спринт</span>
            </div>
            
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                        dataKey="name" 
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis stroke="#6b7280" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                        wrapperStyle={{ paddingTop: '20px' }}
                        iconType="circle"
                    />
                    <Bar 
                        dataKey="Всього SP" 
                        fill="#60a5fa" 
                        radius={[8, 8, 0, 0]}
                    />
                    <Bar 
                        dataKey="Виконано SP" 
                        fill="#34d399" 
                        radius={[8, 8, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>

            <div className="mt-6 grid grid-cols-3 gap-4">
                {data.slice(0, 3).map((sprint, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                        <div className="text-xs text-gray-500 mb-1">#{idx + 1} {sprint.sprintName}</div>
                        <div className="text-2xl font-bold text-gray-800">{sprint.completedStoryPoints} SP</div>
                        <div className="text-xs text-green-600 font-medium mt-1">
                            {sprint.completionRate}% завершено
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default VelocityChart;
