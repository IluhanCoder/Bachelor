import { QuickStatsResponse } from "./analytics-types";

interface LocalParams {
    stats: QuickStatsResponse | null;
}

function QuickStatsCards({ stats }: LocalParams) {
    if (!stats) return null;

    const cards = [
        {
            title: "Всього задач",
            value: stats.totalTasks,
            icon: "📋",
            color: "blue",
            gradient: "from-blue-500 to-blue-600"
        },
        {
            title: "Виконано",
            value: stats.completedTasks,
            icon: "✅",
            color: "green",
            gradient: "from-green-500 to-green-600",
            subtitle: `${stats.completionRate}% завершено`
        },
        {
            title: "В роботі",
            value: stats.inProgressTasks,
            icon: "⚡",
            color: "yellow",
            gradient: "from-yellow-500 to-yellow-600"
        },
        {
            title: "Очікують",
            value: stats.todoTasks,
            icon: "📝",
            color: "gray",
            gradient: "from-gray-500 to-gray-600"
        },
        {
            title: "Story Points",
            value: stats.totalStoryPoints,
            icon: "🎯",
            color: "purple",
            gradient: "from-purple-500 to-purple-600",
            subtitle: `${stats.completedStoryPoints} виконано`
        },
        {
            title: "Команда",
            value: stats.teamSize,
            icon: "👥",
            color: "indigo",
            gradient: "from-indigo-500 to-indigo-600",
            subtitle: `${stats.avgTasksPerMember} задач/особу`
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {cards.map((card, index) => (
                <div
                    key={index}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                    <div className={`h-2 bg-gradient-to-r ${card.gradient}`}></div>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-4xl">{card.icon}</span>
                            <div className={`px-3 py-1 bg-${card.color}-100 text-${card.color}-600 rounded-full text-sm font-medium`}>
                                {card.title}
                            </div>
                        </div>
                        <div className="text-4xl font-bold text-gray-800 mb-2">
                            {card.value}
                        </div>
                        {card.subtitle && (
                            <div className="text-sm text-gray-500">
                                {card.subtitle}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default QuickStatsCards;
