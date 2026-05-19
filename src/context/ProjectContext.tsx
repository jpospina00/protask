import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Project } from '@/types'
import * as projectService from '@/services/api/projects'

interface ProjectContextValue {
  projects: Project[]
  loading: boolean
  loadProjects: () => Promise<void>
  getProjectById: (id: string) => Promise<Project | undefined>
  createProject: (data: Omit<Project, 'id'>) => Promise<Project>
  updateProject: (id: string, data: Partial<Project>) => Promise<Project>
  deleteProject: (id: string) => Promise<void>
}

const ProjectContext = createContext<ProjectContextValue | null>(null)

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)

  const loadProjects = useCallback(async () => {
    setLoading(true)
    try {
      const data = await projectService.getProjects()
      setProjects(data)
    } finally {
      setLoading(false)
    }
  }, [])

  const getProjectById = useCallback(async (id: string) => {
    return projectService.getProjectById(id)
  }, [])

  const createProject = useCallback(async (data: Omit<Project, 'id'>) => {
    const project = await projectService.createProject(data)
    setProjects((prev) => [...prev, project])
    return project
  }, [])

  const updateProject = useCallback(async (id: string, data: Partial<Project>) => {
    const project = await projectService.updateProject(id, data)
    setProjects((prev) => prev.map((p) => (p.id === id ? project : p)))
    return project
  }, [])

  const deleteProject = useCallback(async (id: string) => {
    await projectService.deleteProject(id)
    setProjects((prev) => prev.filter((p) => p.id !== id))
  }, [])

  return (
    <ProjectContext.Provider value={{ projects, loading, loadProjects, getProjectById, createProject, updateProject, deleteProject }}>
      {children}
    </ProjectContext.Provider>
  )
}

export function useProjects() {
  const ctx = useContext(ProjectContext)
  if (!ctx) throw new Error('useProjects debe usarse dentro de ProjectProvider')
  return ctx
}
