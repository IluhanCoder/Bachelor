import { VscCheck } from "react-icons/vsc"

interface LocalParams {
    priority: string,
    className?: string
}

function TaskPriorityDisplayer ({priority, className}: LocalParams) {
    const color = (priority === "hight") ? "text-red-600" : (priority === "mid") ? "text-yellow-600" : "text-blue-600"
    const label = (priority === "hight") ? "високий" : (priority === "mid") ? "середній" : "низький";

    return <div className={color + " flex gap-2 " + className}>{`пріоритет: ${label}`}</div>
}

export default TaskPriorityDisplayer;