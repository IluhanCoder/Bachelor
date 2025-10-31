import { VscCheck } from "react-icons/vsc"

interface LocalParams {
    status: string,
    className?: string
}

function TaskStatusDisplayer ({status, className}: LocalParams) {
    const getStatusConfig = () => {
        switch(status) {
            case "toDo":
                return {
                    color: "bg-red-100 text-red-700 border-red-200",
                    label: "To Do",
                    icon: (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )
                };
            case "inProgress":
                return {
                    color: "bg-blue-100 text-blue-700 border-blue-200",
                    label: "In Progress",
                    icon: (
                        <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    )
                };
            case "done":
                return {
                    color: "bg-green-100 text-green-700 border-green-200",
                    label: "Done",
                    icon: (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    )
                };
            default:
                return {
                    color: "bg-gray-100 text-gray-700 border-gray-200",
                    label: status,
                    icon: null
                };
        }
    };

    const config = getStatusConfig();

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.color} ${className || ''}`}>
            {config.icon}
            {config.label}
        </span>
    );
}

export default TaskStatusDisplayer;