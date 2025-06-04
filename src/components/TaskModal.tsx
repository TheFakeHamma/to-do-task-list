import { useEffect, useState } from "react"
import type { Task } from "../types/task"

export const TaskModal = ({
    task,
    onClose,
    onSave,
}: {
    task: Task
    onClose: () => void
    onSave: (updated: Task) => void
}) => {
    const [closing, setClosing] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [title, setTitle] = useState(task.title)
    const [desc, setDesc] = useState(task.description)

    const handleClose = () => {
        setClosing(true)
        setTimeout(() => onClose(), 200)
    }

    const handleSave = () => {
        onSave({ ...task, title, description: desc })
        setIsEditing(false)
        handleClose()
    }

    useEffect(() => {
        const esc = (e: KeyboardEvent) => e.key === "Escape" && handleClose()
        window.addEventListener("keydown", esc)
        return () => window.removeEventListener("keydown", esc)
    }, [])

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div
                className={`bg-[#111] border border-[var(--border-terminal)] text-[var(--text-primary)] p-6 rounded w-full max-w-md relative ${closing ? "modal-close" : "modal-open"
                    }`}
            >
                <button
                    onClick={handleClose}
                    className="absolute top-2 right-4 text-[var(--text-secondary)] text-xl font-bold"
                >
                    ×
                </button>

                {isEditing ? (
                    <>
                        <h2 className="text-xl font-bold mb-2">Edit Task</h2>
                        <input
                            className="w-full mb-2 p-2 bg-black border border-[var(--border-terminal)] text-[var(--text-primary)] font-mono"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <textarea
                            className="w-full p-2 bg-black border border-[var(--border-terminal)] text-[var(--text-primary)] font-mono"
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            rows={4}
                        ></textarea>
                        <div className="flex justify-between mt-4">
                            <button onClick={() => setIsEditing(false)} className="text-sm">Cancel</button>
                            <button onClick={handleSave} className="text-sm font-bold text-[var(--text-secondary)]">Save</button>
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold mb-2">{task.title}</h2>
                        <p className="text-sm text-[var(--text-muted)]">{task.description}</p>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="mt-4 text-sm text-[var(--text-secondary)] underline"
                        >
                            ✏️ Edit
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}
