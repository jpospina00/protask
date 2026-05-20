import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { ArrowLeft, Plus, Calendar, Users, Settings, Edit, Trash2, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { useProjects } from '@/context/ProjectContext'
import { useTasks } from '@/context/TaskContext'
import { getUsers } from '@/services/api/users'
import { ProjectMetrics } from '@/features/projects/ProjectMetrics'
import { ProjectTaskList } from '@/features/projects/ProjectTaskList'
import { ProjectDialog } from '@/features/projects/ProjectDialog'
import { AddCollaboratorsDialog } from '@/features/projects/AddCollaboratorsDialog'
import { TaskDialog } from '@/features/tasks/TaskDialog'
import { DeleteConfirmDialog } from '@/components/shared/DeleteConfirmDialog'
import type { User, Task } from '@/types'

export function ProjectDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { projects, loadProjects, updateProject, deleteProject } = useProjects()
  const { tasks, loadTasksByProject, deleteTask } = useTasks()
  const [users, setUsers] = useState<User[]>([])

  const project = projects.find((p) => p.id === id)

  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined)
  const [collaboratorsDialogOpen, setCollaboratorsDialogOpen] = useState(false)
  const [projectDialogOpen, setProjectDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)
  const [deleteProjectDialogOpen, setDeleteProjectDialogOpen] = useState(false)

  useEffect(() => {
    loadProjects()
    getUsers().then(setUsers)
  }, [loadProjects])

  useEffect(() => {
    if (id) loadTasksByProject(id)
  }, [id, loadTasksByProject])

  if (!project) {
    return (
      <div className="p-8">
        <p>Proyecto no encontrado</p>
      </div>
    )
  }

  const projectTasks = tasks.filter((t) => t.projectId === project.id)
  const owner = users.find((u) => u.id === project.owner)
  const teamMembers = project.teamMembers.map((mid) => users.find((u) => u.id === mid)).filter(Boolean)

  const taskStats = {
    pending: projectTasks.filter((t) => t.status === 'pending').length,
    inProgress: projectTasks.filter((t) => t.status === 'in_progress').length,
    completed: projectTasks.filter((t) => t.status === 'completed').length,
    overdue: projectTasks.filter((t) => t.status === 'overdue').length,
  }

  const handleEditTask = (task: Task) => {
    setSelectedTask(task)
    setTaskDialogOpen(true)
  }

  const handleNewTask = () => {
    setSelectedTask(undefined)
    setTaskDialogOpen(true)
  }

  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteTask = async () => {
    if (taskToDelete) {
      await deleteTask(taskToDelete)
      toast.success('Tarea eliminada')
      setTaskToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const handleAddCollaborators = async (userIds: string[]) => {
    await updateProject(project.id, {
      teamMembers: [...new Set([...project.teamMembers, ...userIds])],
    })
    toast.success('Colaboradores añadidos')
  }

  const confirmDeleteProject = async () => {
    await deleteProject(project.id)
    toast.success(`"${project.name}" ha sido eliminado`)
    navigate('/projects')
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/projects">
          <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>
          <p className="text-slate-600 mt-1">{project.description}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon"><Settings className="w-4 h-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setProjectDialogOpen(true)}>
              <Edit className="w-4 h-4 mr-2" />Editar proyecto
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" onClick={() => setDeleteProjectDialogOpen(true)}>
              <Trash2 className="w-4 h-4 mr-2" />Eliminar proyecto
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button className="gap-2" onClick={handleNewTask}>
          <Plus className="w-4 h-4" />Nueva Tarea
        </Button>
      </div>

      <ProjectMetrics
        progress={project.progress}
        completed={taskStats.completed}
        inProgress={taskStats.inProgress}
        overdue={taskStats.overdue}
        total={projectTasks.length}
      />

      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader><CardTitle>Detalles del Proyecto</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600 mb-1">Responsable</p>
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={owner?.avatar} />
                    <AvatarFallback>{owner?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{owner?.name}</p>
                    <p className="text-xs text-slate-500">{owner?.role}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Fecha de entrega</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-900">
                    {new Date(project.endDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Equipo ({teamMembers.length})
              </CardTitle>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => setCollaboratorsDialogOpen(true)}>
                <UserPlus className="w-4 h-4" />Añadir
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {teamMembers.slice(0, 5).map((member) => (
              <div key={(member as User).id} className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={(member as User).avatar} />
                  <AvatarFallback>{(member as User).name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">{(member as User).name}</p>
                  <p className="text-xs text-slate-500 truncate">{(member as User).role}</p>
                </div>
              </div>
            ))}
            {teamMembers.length > 5 && (
              <div className="pt-2 border-t border-slate-200">
                <p className="text-xs text-slate-500 text-center">+{teamMembers.length - 5} miembros más</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ProjectTaskList
        tasks={projectTasks}
        users={users}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
      />

      <TaskDialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen} task={selectedTask} projectId={project.id} />

      <AddCollaboratorsDialog
        open={collaboratorsDialogOpen}
        onOpenChange={setCollaboratorsDialogOpen}
        currentCollaborators={project.teamMembers}
        onAdd={handleAddCollaborators}
      />

      <ProjectDialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen} project={project} />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDeleteTask}
        title="¿Eliminar tarea?"
        description="Esta acción no se puede deshacer. La tarea será eliminada permanentemente."
      />

      <DeleteConfirmDialog
        open={deleteProjectDialogOpen}
        onOpenChange={setDeleteProjectDialogOpen}
        onConfirm={confirmDeleteProject}
        title="¿Eliminar proyecto?"
        description="Esta acción no se puede deshacer. El proyecto y todas sus tareas serán eliminados permanentemente."
      />
    </div>
  )
}
