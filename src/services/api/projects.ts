import type { Project } from '@/types'
import { mockProjects } from '@/mocks/data'

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms))

let projects = [...mockProjects]

export async function getProjects(): Promise<Project[]> {
  await delay()
  return [...projects]
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  await delay()
  return projects.find((p) => p.id === id)
}

export async function createProject(data: Omit<Project, 'id'>): Promise<Project> {
  await delay(400)
  const project: Project = { id: `proj_${Date.now()}`, ...data }
  projects.push(project)
  return project
}

export async function updateProject(id: string, data: Partial<Project>): Promise<Project> {
  await delay(300)
  const index = projects.findIndex((p) => p.id === id)
  if (index === -1) throw new Error('Proyecto no encontrado')
  projects[index] = { ...projects[index], ...data }
  return projects[index]
}

export async function deleteProject(id: string): Promise<void> {
  await delay(300)
  projects = projects.filter((p) => p.id !== id)
}

export async function getProjectsByOwner(ownerId: string): Promise<Project[]> {
  await delay()
  return projects.filter((p) => p.owner === ownerId)
}

export async function addCollaborators(projectId: string, userIds: string[]): Promise<Project> {
  await delay(300)
  const project = projects.find((p) => p.id === projectId)
  if (!project) throw new Error('Proyecto no encontrado')
  const existing = new Set(project.teamMembers)
  userIds.forEach((id) => existing.add(id))
  project.teamMembers = [...existing]
  return project
}
