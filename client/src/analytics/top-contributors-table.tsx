import { TopContributor } from "./analytics-types";

interface LocalParams {
    contributors: TopContributor[];
}

function TopContributorsTable({ contributors }: LocalParams) {
    if (!contributors || contributors.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center text-gray-500">
                <span className="text-4xl mb-4 block">👥</span>
                No contributor data available
            </div>
        );
    }

    const medals = ['🥇', '🥈', '🥉'];

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🏆</span>
                <h2 className="text-2xl font-bold text-gray-800">Top Contributors</h2>
                <span className="text-sm text-gray-500 ml-auto">By Completed Story Points</span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Rank</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Participant</th>
                            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Completed Tasks</th>
                            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Story Points</th>
                            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">In Progress</th>
                            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contributors.map((contributor, index) => (
                            <tr 
                                key={contributor.userId}
                                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                            >
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">
                                            {index < 3 ? medals[index] : `#${index + 1}`}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                            {contributor.userName.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-medium text-gray-800">{contributor.userName}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-center">
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                                        <span>✅</span>
                                        {contributor.completedTasks}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-center">
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-bold">
                                        <span>🎯</span>
                                        {contributor.completedStoryPoints} SP
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-center">
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">
                                        <span>⚡</span>
                                        {contributor.inProgressTasks}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-center">
                                    <span className="text-gray-600 font-medium">{contributor.totalTasks}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {contributors.length > 0 && (
                <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">💪</span>
                        <div>
                            <div className="font-semibold text-gray-800">
                                Team Leader: {contributors[0].userName}
                            </div>
                            <div className="text-sm text-gray-600">
                                {contributors[0].completedStoryPoints} Story Points · {contributors[0].completedTasks} completed tasks
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TopContributorsTable;
