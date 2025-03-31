"use client"

import { useState, useEffect } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useTaskStore } from "@/lib/store"
import { createTask } from "@/lib/api"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface AddTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  companyId: string | null
}

export default function AddTaskDialog({ open, onOpenChange, companyId }: AddTaskDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("Medium")
  const [dueDate, setDueDate] = useState("")
  const [status, setStatus] = useState("To Do")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { fetchCompanies } = useTaskStore() 

  useEffect(() => {
    if (open) {
      console.log('AddTaskDialog opened with companyId:', companyId);
    }
  }, [open, companyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submission started with companyId:', companyId)
    
    if (!companyId) {
      console.error('Missing companyId in AddTaskDialog')
      toast.error("Company ID is required")
      return
    }

    if (!title.trim() || !description.trim()) {
      console.log('Missing required fields:', { title, description })
      toast.error("Title and description are required")
      return
    }

    setIsSubmitting(true)
    
    try {
      const taskData = {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined
      }

      console.log('Creating task with data:', { taskData, companyId })

      const result = await createTask(companyId, taskData)    
      
      if (result) {
        toast.success("Task created successfully")
        setTitle("")
        setDescription("")
        setPriority("Medium")
        setDueDate("")
        setStatus("To Do")
        onOpenChange(false)
        await fetchCompanies()
      }
    } catch (error: any) {
      console.error('Task creation error:', error)
      toast.error(error.message || "Failed to create task. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    console.log('AddTaskDialog companyId:', companyId)
  }, [companyId])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Create a new task by filling out the form below. All fields except due date are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4" aria-label="Create task form">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
              aria-required="true"
              aria-label="Task title"
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
              aria-required="true"
              aria-label="Task description"
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={status} 
              onValueChange={setStatus}
              aria-label="Task status"
            >
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
            <Select 
              value={priority} 
              onValueChange={setPriority}
              aria-label="Task priority"
            >
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
              aria-label="Task due date"
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full"
            aria-label={isSubmitting ? "Creating task..." : "Create task"}
          >
            {isSubmitting ? "Creating..." : "Create Task"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
