import { VscCheck } from "react-icons/vsc"

interface LocalParams {
    priority: string,
    className?: string
}

function TaskPriorityDisplayer ({priority, className}: LocalParams) {
    const getPriorityConfig = () => {
        switch(priority) {
            case "hight":
                return {
                    color: "bg-red-100 text-red-700 border-red-200",
                    label: "High",
                    icon: (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L2 22h20L12 2z"/>
                        </svg>
                    )
                };
            case "mid":
                return {
                    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
                    label: "Medium",
                    icon: (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10"/>
                        </svg>
                    )
                };
            case "low":
                return {
                    color: "bg-blue-100 text-blue-700 border-blue-200",
                    label: "Low",
                    icon: (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 22L2 2h20L12 22z"/>
                        </svg>
                    )
                };
            default:
                return {
                    color: "bg-gray-100 text-gray-700 border-gray-200",
                    label: priority,
                    icon: null
                };
        }
    };

    const config = getPriorityConfig();

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.color} ${className || ''}`}>
            {config.icon}
            {config.label}
        </span>
    );
}

export default TaskPriorityDisplayer;