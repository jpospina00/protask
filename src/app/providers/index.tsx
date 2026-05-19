import { type ReactNode } from 'react'
import { AuthProvider } from '@/context/AuthContext'
import { ProjectProvider } from '@/context/ProjectContext'
import { TaskProvider } from '@/context/TaskContext'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ProjectProvider>
        <TaskProvider>
          {children}
        </TaskProvider>
      </ProjectProvider>
    </AuthProvider>
  )
}
