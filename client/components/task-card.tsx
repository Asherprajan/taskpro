"use client"

import { useState, useEffect } from "react"
import { Draggable, DraggableProvided, DraggableStateSnapshot } from "react-beautiful-dnd"
import { Calendar, AlertCircle, MoreVertical, Pencil, Trash2 } from "lucide-react"
import { format } from "date-fns"
import type { Task } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import EditTaskDialog from "./edit-task-dialog"
import { useTaskStore } from "@/lib/store"
import { toast } from "sonner"

interface TaskCardProps {
  task: Task
  index: number
}

export default function TaskCard({ task, index }: TaskCardProps) {
  const [enabled, setEnabled] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const { deleteTask } = useTaskStore()

  useEffect(() => {
    // This is a workaround for the hydration issue with react-beautiful-dnd
    const timeout = setTimeout(() => setEnabled(true), 100) // Increased timeout
    return () => clearTimeout(timeout)
  }, [])

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      console.log('Deleting task:', task._id); // Debug log
      await deleteTask(task._id);
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete task");
    }
  }

  const priorityColors = {
    Low: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800",
    High: "bg-red-100 text-red-800",
  }

  const priorityColor = priorityColors[task.priority as keyof typeof priorityColors]

  const TaskContent = () => (
    <>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-sm">{task.title}</h4>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {task.description && (
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
          {task.description}
        </p>
      )}
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
        <div className="flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          <span>{task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : "No due date"}</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className={cn("text-xs px-2 py-1 rounded-full font-medium", priorityColor)}>
          {task.priority}
        </span>
        {task.priority === "High" && <AlertCircle className="h-4 w-4 text-red-500" />}
      </div>
    </>
  )

  // Show loading state while drag and drop is being enabled
  if (!enabled) {
    return (
      <div className="bg-card p-3 rounded-md shadow-sm mb-2 border">
        <TaskContent />
      </div>
    )
  }

  return (
    <>
      <Draggable draggableId={task._id.toString()} index={index}>
        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={cn(
              "bg-card p-3 rounded-md shadow-sm mb-2 border cursor-grab",
              snapshot.isDragging && "shadow-md cursor-grabbing"
            )}
          >
            <TaskContent />
          </div>
        )}
      </Draggable>
      <EditTaskDialog 
        open={isEditOpen} 
        onOpenChange={setIsEditOpen} 
        task={task} 
      />
    </>
  )
}
