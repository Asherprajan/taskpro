export interface Task {
  _id: string  // Changed from id to _id to match MongoDB
  title: string
  description: string
  status: string
  priority: string
  dueDate?: Date
  companyId: string
  createdAt: Date
}

export interface Company {
  _id: string;  // MongoDB uses _id by default
  name: string;
  tasks: Task[];
}

