"use client"

import { Droppable } from "react-beautiful-dnd"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import TaskColumn from "@/components/task-column"
import type { Company } from "@/lib/types"
import { useTaskStore } from "@/lib/store"

interface CompanyBoardProps {
  company: Company
  onAddTask: (companyId: string) => void
}

export default function CompanyBoard({ company, onAddTask }: CompanyBoardProps) {
  const { moveTask } = useTaskStore()
  const columns = ["To Do", "In Progress", "Completed"]

  const handleAddTask = () => {
    console.log('CompanyBoard - Company data:', company); // Debug log
    console.log('CompanyBoard - Adding task for company:', company._id); // Debug log
    onAddTask(company._id);
  };

  return (
    <div className="border rounded-lg shadow-sm bg-card">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold">{company.name}</h2>
        <Button 
          onClick={handleAddTask}
          variant="outline" 
          size="sm"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map((column) => (
            <Droppable 
              key={`${company._id}-${column}`} 
              droppableId={`${company._id}-${column}`}
              isDropDisabled={false}
            >
              {(provided) => (
                <TaskColumn
                  title={column}
                  tasks={company.tasks.filter((task) => task.status === column)}
                  provided={provided}
                />
              )}
            </Droppable>
          ))}
        </div>
      </div>
    </div>
  );
}
