import { useEffect, useState } from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import type { Task } from "./types/task"
import { TaskModal } from "./components/TaskModal"
import { TaskItem } from "./components/TaskItem"

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem("tasks")
    return stored ? JSON.parse(stored) : []
  })
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [newTask, setNewTask] = useState("")
  const [newDesc, setNewDesc] = useState("")
  const [theme, setTheme] = useState("")

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    document.documentElement.className = theme
  }, [theme])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "k") {
        e.preventDefault()
        const input = document.getElementById("taskInput") as HTMLInputElement
        input?.focus()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return
    const reordered = Array.from(tasks)
    const [removed] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, removed)
    setTasks(reordered)
  }

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.trim()) return

    const newItem: Task = {
      id: Date.now().toString(),
      title: newTask.trim(),
      description: newDesc.trim() || "No description.",
      completed: false
    }

    setTasks(prev => [...prev, newItem])
    setNewTask("")
    setNewDesc("")
  }

  const toggleComplete = (id: string) => {
    const updated = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed, animating: true } : task
    )

    setTasks(updated)

    setTimeout(() => {
      const reordered = updated.map(t => ({ ...t, animating: false }))
      reordered.sort((a, b) => Number(a.completed) - Number(b.completed))
      setTasks(reordered)
    }, 300)
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="boot-animate">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-center w-full">
            Terminal TODO<span className="cursor-blink ml-1">&nbsp;</span>
          </h1>
          <div className="flex gap-2 absolute top-4 right-4">
            <button onClick={() => setTheme("")}>🟢</button>
            <button onClick={() => setTheme("theme-cyan")}>🔵</button>
            <button onClick={() => setTheme("theme-amber")}>🟡</button>
            <button onClick={() => setTheme("theme-pink")}>💖</button>
          </div>
        </div>

        <form onSubmit={handleAddTask} className="mb-6 space-y-2">
          <input
            id="taskInput"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="w-full bg-black text-[var(--text-primary)] border border-[var(--border-terminal)] p-2 font-mono"
            placeholder="Task title..."
          />
          <input
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            className="w-full bg-black text-[var(--text-primary)] border border-[var(--border-terminal)] p-2 font-mono"
            placeholder="Task description..."
          />
          <button
            type="submit"
            className="mt-2 px-4 py-2 border border-[var(--border-terminal)] text-[var(--text-primary)] font-bold w-full"
          >
            + Add Task
          </button>
        </form>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="taskList">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
                {tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`w-full ${snapshot.isDragging ? "dragging" : ""}`}
                      >
                        <TaskItem
                          task={task}
                          onClick={() => setSelectedTask(task)}
                          onToggle={() => toggleComplete(task.id)}
                          onDelete={() => deleteTask(task.id)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {selectedTask && (
          <TaskModal
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onSave={(updated) => {
              setTasks(tasks.map(t => (t.id === updated.id ? updated : t)))
            }}
          />
        )}
      </div>
    </div>
  )
}
