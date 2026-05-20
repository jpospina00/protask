import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Task } from '@/types'
import * as taskService from '@/services/api/tasks'

interface TaskContextValue {
  tasks: Task[]
  allTasks: Task[]
  loading: boolean
  loadTasksByProject: (projectId: string) => Promise<void>
  loadAllTasks: () => Promise<void>
  createTask: (data: Omit<Task, 'id' | 'createdAt' | 'attachments' | 'comments'>) => Promise<Task>
  updateTask: (id: string, data: Partial<Task>) => Promise<Task>
  deleteTask: (id: string) => Promise<void>
  getTaskStats: (projectId: string) => Promise<{ total: number; completed: number; inProgress: number; pending: number; overdue: number }>
}

const TaskContext = createContext<TaskContextValue | null>(null)

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [allTasks, setAllTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)

  const loadTasksByProject = useCallback(async (projectId: string) => {
    setLoading(true)
    try {
      const data = await taskService.getTasksByProject(projectId)
      setTasks(data)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadAllTasks = useCallback(async () => {
    setLoading(true)
    try {
      const data = await taskService.getTasks()
      setAllTasks(data)
    } finally {
      setLoading(false)
    }
  }, [])

  const createTask = useCallback(async (data: Omit<Task, 'id' | 'createdAt' | 'attachments' | 'comments'>) => {
    const task = await taskService.createTask(data)
    setTasks((prev) => [...prev, task])
    setAllTasks((prev) => [...prev, task])
    return task
  }, [])

  const updateTask = useCallback(async (id: string, data: Partial<Task>) => {
    const task = await taskService.updateTask(id, data)
    setTasks((prev) => prev.map((t) => (t.id === id ? task : t)))
    setAllTasks((prev) => prev.map((t) => (t.id === id ? task : t)))
    return task
  }, [])

  const deleteTask = useCallback(async (id: string) => {
    await taskService.deleteTask(id)
    setTasks((prev) => prev.filter((t) => t.id !== id))
    setAllTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const getTaskStats = useCallback(async (projectId: string) => {
    return taskService.getTaskStats(projectId)
  }, [])

  return (
    <TaskContext.Provider value={{ tasks, allTasks, loading, loadTasksByProject, loadAllTasks, createTask, updateTask, deleteTask, getTaskStats }}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const ctx = useContext(TaskContext)
  if (!ctx) throw new Error('useTasks debe usarse dentro de TaskProvider')
  return ctx
}
