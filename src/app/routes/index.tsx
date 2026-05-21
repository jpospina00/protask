import { createBrowserRouter } from 'react-router'
import { AppLayout } from '@/app/layouts/AppLayout'
import { Login } from '@/features/auth/Login'
import { Register } from '@/features/auth/Register'
import { Dashboard } from '@/features/dashboard/Dashboard'
import { ProjectsPage } from '@/features/projects/ProjectsPage'
import { ProjectDetailPage } from '@/features/projects/ProjectDetailPage'
import { WorkloadPage } from '@/features/workload/WorkloadPage'
import { ProfilePage } from '@/features/profile/ProfilePage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'projects/:id', element: <ProjectDetailPage /> },
      { path: 'workload', element: <WorkloadPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },
])
