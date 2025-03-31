"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import type { Task } from "@/lib/types"
import { useTaskStore } from "@/lib/store"

interface EditTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: Task | null
}

export default function EditTaskDialog({ open, onOpenChange, task }: EditTaskDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("Medium")
  const [dueDate, setDueDate] = useState("")
  const [status, setStatus] = useState("To Do")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { updateTask } = useTaskStore()

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description)
      setPriority(task.priority)
      setStatus(task.status)
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '')
    }
  }, [task])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!task) return

    console.log('Submitting task update:', {
      taskId: task._id,
      updates: {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined
      }
    })

    setIsSubmitting(true)
    try {
      await updateTask(task._id, {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined
      })
      
      toast.success("Task updated successfully")
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to update task:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update task")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              required
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="To Do">To Do</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger id="priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date (Optional)</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Updating..." : "Update Task"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 