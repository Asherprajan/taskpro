"use client"

import { create } from "zustand"
import { v4 as uuidv4 } from "uuid"
import type { Company, Task } from "./types"
import { fetchCompanies as apiFetchCompanies, createCompany, createTask, updateTaskStatus, updateTaskInAPI, deleteTaskFromAPI } from './api'

// Define API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

interface TaskState {
  companies: Company[]
  addCompany: (name: string) => Promise<void>
  addTask: (companyId: string, task: Omit<Task, "id">) => Promise<void>
  moveTask: (
    taskId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    sourceIndex: number,
    destinationIndex: number,
  ) => Promise<void>
  loading: boolean
  error: string | null
  fetchCompanies: () => Promise<void>
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (taskId: string) => Promise<void>
}

export const useTaskStore = create<TaskState>((set) => ({
  companies: [],
  loading: false,
  error: null,

  fetchCompanies: async () => {
    set({ loading: true, error: null })
    try {
      const data = await apiFetchCompanies()
      console.log('Fetched companies data:', data)
      set({ companies: data, loading: false })
    } catch (error) {
      console.error('Error fetching companies:', error)
      set({ error: error instanceof Error ? error.message : 'An unknown error occurred', loading: false })
    }
  },

  addCompany: async (name: string) => {
    try {
      const company = await createCompany(name)
      set((state) => ({
        companies: [...state.companies, company],
      }))
    } catch (error) {
          set({ error: error instanceof Error ? error.message : 'An unknown error occurred' })
    }
  },

  addTask: async (companyId: string, task: Omit<Task, "id">) => {
    try {
      const newTask = await createTask(companyId, task)
      set((state) => ({
        companies: state.companies.map((company) => 
          company._id === companyId
            ? { ...company, tasks: [...company.tasks, newTask] }
            : company
        ),
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An unknown error occurred' })
    }
  },

  moveTask: async (
    taskId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    sourceIndex: number,
    destinationIndex: number
  ) => {
    try {
      const status = destinationColumnId.split('-')[1]
      await updateTaskStatus(taskId, status)
      
      set((state) => {
        const companies = [...state.companies]
        const sourceCompany = companies.find((c) => c._id === sourceColumnId.split('-')[0])
        const destinationCompany = companies.find((c) => c._id === destinationColumnId.split('-')[0])
        
        if (sourceCompany && destinationCompany) {
          const task = sourceCompany.tasks.find((t) => t._id === taskId)
          if (task) {
            sourceCompany.tasks = sourceCompany.tasks.filter((t) => t._id !== taskId)
            destinationCompany.tasks.splice(destinationIndex, 0, {
              ...task,
              status,
            })
          }
        }
        return { companies }
      })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An unknown error occurred' })
    }
  },

  updateTask: async (taskId: string, updates: Partial<Task>) => {
    try {
      const updatedTask = await updateTaskInAPI(taskId, updates)
      set((state) => ({
        companies: state.companies.map((company) => ({
          ...company,
          tasks: company.tasks.map((task) => 
            task._id === taskId ? { ...task, ...updatedTask } : task
          )
        }))
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An unknown error occurred' })
      throw error
    }
  },

  deleteTask: async (taskId: string) => {
    try {
      await deleteTaskFromAPI(taskId)
      set((state) => ({
        companies: state.companies.map((company) => ({
          ...company,
          tasks: company.tasks.filter((task) => task._id !== taskId)
        }))
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An unknown error occurred' })
      throw error
    }
  }
}))
