import type { Task } from "../types/task"

export const TaskItem = ({
    task,
    onClick,
    onToggle,
    onDelete,
}: {
    task: Task
    onClick: () => void
    onToggle: () => void
    onDelete: () => void
}) => {
    return (
        <div className={`card flex justify-between items-center ${task.animating ? "completed-animation" : ""}`}>
            <div onClick={onClick} className={`flex-1 ${task.completed ? "completed" : ""}`}>
                <h2 className="text-lg font-semibold">{task.title}</h2>
                <p className="text-description">{task.description}</p>
            </div>

            <div className="flex gap-2 ml-4 items-center">
                <button onClick={onDelete} className="text-[var(--text-secondary)] text-sm">🗑</button>
                <label className="inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={onToggle}
                        className="hidden"
                    />
                    <span className="w-6 h-6 border-2 border-[var(--border-terminal)] text-[var(--text-primary)] flex items-center justify-center text-xl font-bold">
                        {task.completed ? "✔" : ""}
                    </span>
                </label>
            </div>
        </div>
    )
}
