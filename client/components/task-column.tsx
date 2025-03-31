import type { DroppableProvided } from "react-beautiful-dnd"
import TaskCard from "@/components/task-card"
import type { Task } from "@/lib/types"

interface TaskColumnProps {
  title: string
  tasks: Task[]
  provided: DroppableProvided
}

export default function TaskColumn({ title, tasks, provided }: TaskColumnProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-sm">{title}</h3>
        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">{tasks.length}</span>
      </div>
      <div
        ref={provided.innerRef}
        {...provided.droppableProps}
        className="bg-muted/50 rounded-lg p-2 flex-1 min-h-[200px]"
      >
        {tasks.map((task, index) => (
          <TaskCard key={task._id} task={task} index={index} />
        ))}
        {provided.placeholder}
      </div>
    </div>
  )
}
