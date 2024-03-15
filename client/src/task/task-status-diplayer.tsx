import { VscCheck } from "react-icons/vsc"

interface LocalParams {
    status: string,
    className?: string
}

function TaskStatusDisplayer ({status, className}: LocalParams) {
    const color = (status === "toDo") ? "text-red-600" : (status === "inProgress") ? "text-blue-600" : "text-green-600"
    const label = (status === "toDo") ? "треба виконати" : (status === "inProgress") ? "в процесі" : "виконано";

    return <div className={color + " flex gap-2 " + className}>{status === "done" && <VscCheck className="mt-1"/>}{label}</div>
}

export default TaskStatusDisplayer;