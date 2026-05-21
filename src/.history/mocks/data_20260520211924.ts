import type { User, Project, Task, Notification } from '../types'

export const mockUsers: User[] = [
  {
    id: 'user_1',
    name: 'Ana García',
    email: 'ana.garcia@protask.com',
    avatar: '',
    role: 'Project Manager',
    password: 'password123',
  },
]

export const mockProjects: Project[] = [
  {
    id: 'proj_1',
    name: 'Rediseño Web Corporativo',
    description: 'Rediseño completo del sitio web corporativo con enfoque en experiencia de usuario y rendimiento.',
    progress: 65,
    owner: 'user_1',
    startDate: '2025-01-15',
    endDate: '2025-06-30',
    status: 'active',
    teamMembers: ['user_1'],
  },
]

export const mockTasks: Task[] = [
  {
    id: 'task_1',
    title: 'Definir paleta de colores',
    description: 'Seleccionar paleta de colores basada en la identidad de marca y principios de accesibilidad.',
    projectId: 'proj_1',
    assignedTo: 'user_1',
    status: 'completed',
    priority: 'high',
    dueDate: '2025-02-15',
    createdAt: '2025-01-20',
    attachments: [],
    comments: [],
  },
  {
    id: 'task_2',
    title: 'Maquetar página de inicio',
    description: 'Crear el layout responsivo de la página principal con Tailwind CSS.',
    projectId: 'proj_1',
    assignedTo: 'user_1',
    status: 'in_progress',
    priority: 'medium',
    dueDate: '2025-03-10',
    createdAt: '2025-02-01',
    attachments: [],
    comments: [],
  },
]

export const mockNotifications: Notification[] = [
  {
    id: 'notif_1',
    type: 'task_assigned',
    message: 'Te han asignado la tarea "Maquetar página de inicio"',
    userId: 'user_1',
    projectId: 'proj_1',
    taskId: 'task_2',
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
]
