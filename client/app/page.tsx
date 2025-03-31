"use client"

import { useEffect, useState } from "react"
import { DragDropContext, type DropResult } from "react-beautiful-dnd"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import CompanyBoard from "@/components/company-board"
import AddCompanyDialog from "@/components/add-company-dialog"
import AddTaskDialog from "@/components/add-task-dialog"
import { useTaskStore } from "@/lib/store"

export default function TaskManagementApp() {
  const { companies, fetchCompanies, moveTask } = useTaskStore()
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false)
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null)

  useEffect(() => {
    fetchCompanies()
  }, [fetchCompanies])

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    moveTask(draggableId, source.droppableId, destination.droppableId, source.index, destination.index)
  }

  const handleAddTask = (companyId: string) => {
    console.log('TaskManagementApp - Company ID received:', companyId); // Debug log
    if (!companyId) {
      console.error('Company ID is missing');
      return;
    }
    setSelectedCompanyId(companyId);
    setIsAddTaskOpen(true);
  };

  return (
    <main className="container mx-auto p-4 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Task Management</h1>
        <Button onClick={() => setIsAddCompanyOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Company
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="space-y-8">
          {companies.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-lg bg-muted/50">
              <h2 className="text-xl font-medium text-muted-foreground mb-4">No companies yet</h2>
              <Button onClick={() => setIsAddCompanyOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Your First Company
              </Button>
            </div>
          ) : (
            companies.map((company) => (
              <CompanyBoard 
                key={company._id} 
                company={company} 
                onAddTask={handleAddTask}
              />
            ))
          )}
        </div>
      </DragDropContext>

      <AddCompanyDialog open={isAddCompanyOpen} onOpenChange={setIsAddCompanyOpen} />

      <AddTaskDialog 
        open={isAddTaskOpen} 
        onOpenChange={(open) => {
          if (!open) {
            setSelectedCompanyId(null);
          }
          setIsAddTaskOpen(open);
        }} 
        companyId={selectedCompanyId}
      />
    </main>
  )
}

