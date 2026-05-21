import type { Task } from '@/types'
import { mockTasks } from '@/mocks/data'

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms))

let tasks = [...mockTasks]

export async function getTasks(): Promise<Task[]> {
  await delay()
  return [...tasks]
}

export async function getTasksByProject(projectId: string): Promise<Task[]> {
  await delay()
  return tasks.filter((t) => t.projectId === projectId)
}

export async function getTaskById(id: string): Promise<Task | undefined> {
  await delay()
  return tasks.find((t) => t.id === id)
}

export async function createTask(data: Omit<Task, 'id' | 'createdAt' | 'attachments' | 'comments'>): Promise<Task> {
  await delay(400)
  const task: Task = {
    ...data,
    id: `task_${Date.now()}`,
    createdAt: new Date().toISOString(),
    attachments: [],
    comments: [],
  }
  tasks.push(task)
  return task
}

export async function updateTask(id: string, data: Partial<Task>): Promise<Task> {
  await delay(300)
  const index = tasks.findIndex((t) => t.id === id)
  if (index === -1) throw new Error('Tarea no encontrada')
  tasks[index] = { ...tasks[index], ...data }
  return tasks[index]
}

export async function deleteTask(id: string): Promise<void> {
  await delay(300)
  tasks = tasks.filter((t) => t.id !== id)
}

export async function getTasksByUser(userId: string): Promise<Task[]> {
  await delay()
  return tasks.filter((t) => t.assignedTo === userId)
}

export async function getTaskStats(projectId: string): Promise<{ total: number; completed: number; inProgress: number; pending: number; overdue: number }> {
  await delay()
  const projectTasks = tasks.filter((t) => t.projectId === projectId)
  return {
    total: projectTasks.length,
    completed: projectTasks.filter((t) => t.status === 'completed').length,
    inProgress: projectTasks.filter((t) => t.status === 'in_progress').length,
    pending: projectTasks.filter((t) => t.status === 'pending').length,
    overdue: projectTasks.filter((t) => t.status === 'overdue').length,
  }
}
