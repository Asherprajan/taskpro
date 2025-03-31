import { Task } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export const fetchCompanies = async () => { 
  const response = await fetch(`${API_BASE_URL}/companies`);
  if (!response.ok) {
    throw new Error('Failed to fetch companies');
  }
  return response.json();
};

export const createCompany = async (name: string) => {
  const response = await fetch(`${API_BASE_URL}/companies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    throw new Error('Failed to create company');
  }
  return response.json();
};

export const createTask = async (companyId: string, task: {
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate?: Date;
}) => {
  console.log('Creating task with data:', { companyId, task }); // Debug log

  try {
    const payload = {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      companyId
    };
    
    console.log('Sending API request to:', `${API_BASE_URL}/tasks`); // Debug log
    console.log('Request payload:', payload); // Debug log

    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('API Response status:', response.status); // Debug log
    
    if (!response.ok) {
      const error = await response.json();
      console.error('API Error response:', error); // Debug log
      throw new Error(error.message || 'Failed to create task');
    }

    const data = await response.json();
    console.log('API Success response:', data); // Debug log
    return data;
  } catch (error) {
    console.error('API Error details:', {
      name: error instanceof Error ? error.name : 'Unknown Error',
      message: error instanceof Error ? error.message : 'Unknown Error',
      stack: error instanceof Error ? error.stack : 'Unknown Error'
    }); // Detailed error log
    throw error;
  }
};

export const updateTaskStatus = async (taskId: string, status: string) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error('Failed to update task status');
  }
  return response.json();
};

export const updateTaskInAPI = async (taskId: string, updates: Partial<Task>) => {
  console.log('Updating task:', { taskId, updates }); // Debug log

  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    console.log('Update response status:', response.status); // Debug log

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Update error response:', errorData); // Debug log
      throw new Error(errorData.message || 'Failed to update task');
    }

    const data = await response.json();
    console.log('Update success response:', data); // Debug log
    return data;
  } catch (error) {
    console.error('Update task error:', error);
    throw error;
  }
};

export const deleteTaskFromAPI = async (taskId: string) => {
  console.log('Deleting task:', taskId); // Debug log

  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'DELETE',
    });

    console.log('Delete response status:', response.status); // Debug log

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Delete error response:', errorData); // Debug log
      throw new Error(errorData.message || 'Failed to delete task');
    }

    const data = await response.json();
    console.log('Delete success response:', data); // Debug log
    return data;
  } catch (error) {
    console.error('Delete task error:', error);
    throw error;
  }
}; 