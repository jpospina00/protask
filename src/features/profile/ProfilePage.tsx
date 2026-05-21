import { useState } from 'react'
import { User, Mail, Briefcase, Calendar, CheckCircle2, Clock, AlertCircle, FolderKanban } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { EditProfileDialog } from '@/features/profile/EditProfileDialog'
import { useAuth } from '@/context/AuthContext'
import { useProjects } from '@/context/ProjectContext'
import { useTasks } from '@/context/TaskContext'
import { useEffect } from 'react'

export function ProfilePage() {
  const { currentUser } = useAuth()
  const { projects, loadProjects } = useProjects()
  const { allTasks, loadAllTasks } = useTasks()
  const [editProfileOpen, setEditProfileOpen] = useState(false)

  useEffect(() => {
    loadProjects()
    loadAllTasks()
  }, [loadProjects, loadAllTasks])

  if (!currentUser) return null

  const userTasks = allTasks.filter((t) => t.assignedTo === currentUser.id)
  const userProjects = projects.filter((p) => p.owner === currentUser.id)

  const taskStats = {
    total: userTasks.length,
    pending: userTasks.filter((t) => t.status === 'pending').length,
    inProgress: userTasks.filter((t) => t.status === 'in_progress').length,
    completed: userTasks.filter((t) => t.status === 'completed').length,
    overdue: userTasks.filter((t) => t.status === 'overdue').length,
  }

  const completionRate = taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0

  const recentTasks = userTasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)

  const getStatus = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      pending: { label: 'Pendiente', className: 'bg-slate-100 text-slate-700' },
      in_progress: { label: 'En Progreso', className: 'bg-blue-100 text-blue-700' },
      completed: { label: 'Completada', className: 'bg-green-100 text-green-700' },
      overdue: { label: 'Vencida', className: 'bg-red-100 text-red-700' },
    }
    return variants[status] || variants.pending
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Mi Perfil</h1>
        <p className="text-slate-600 mt-1">Información personal y resumen de actividad</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Avatar className="w-32 h-32 mx-auto">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback className="text-3xl">{currentUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold text-slate-900 mt-4">{currentUser.name}</h2>
              <p className="text-slate-600 mt-1">{currentUser.role}</p>
              <Button className="w-full mt-4" onClick={() => setEditProfileOpen(true)}>Editar Perfil</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Información de Contacto</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="text-sm font-medium text-slate-900">{currentUser.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Rol</p>
                  <p className="text-sm font-medium text-slate-900">{currentUser.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Miembro desde</p>
                  <p className="text-sm font-medium text-slate-900">Enero 2024</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Proyectos Liderados</CardTitle>
                <FolderKanban className="w-5 h-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">{userProjects.length}</div>
                <p className="text-xs text-slate-500 mt-1">{userProjects.filter((p) => p.status === 'active').length} activos</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Tasa de Completitud</CardTitle>
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">{completionRate}%</div>
                <Progress value={completionRate} className="h-2 mt-2" />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{taskStats.total}</p>
                    <p className="text-xs text-slate-600">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-900">{taskStats.inProgress}</p>
                    <p className="text-xs text-blue-700">En Progreso</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-900">{taskStats.completed}</p>
                    <p className="text-xs text-green-700">Completadas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className={taskStats.overdue > 0 ? 'border-red-200 bg-red-50' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-200 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-900">{taskStats.overdue}</p>
                    <p className="text-xs text-red-700">Vencidas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Mis Tareas Asignadas</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {recentTasks.length === 0 ? (
                <div className="text-center py-8"><p className="text-slate-500">No tienes tareas asignadas</p></div>
              ) : (
                recentTasks.map((task) => {
                  const project = projects.find((p) => p.id === task.projectId)
                  const statusBadge = getStatus(task.status)
                  return (
                    <div key={task.id} className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/30 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-slate-900">{task.title}</h4>
                          <Badge variant={task.priority === 'high' ? 'destructive' : 'outline'}>
                            {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600">{project?.name}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(task.dueDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                        </div>
                        <Badge className={statusBadge.className}>{statusBadge.label}</Badge>
                      </div>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Proyectos que Lidero</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {userProjects.length === 0 ? (
                <div className="text-center py-8"><p className="text-slate-500">No lideras ningún proyecto</p></div>
              ) : (
                userProjects.map((project) => {
                  const projectTasks = allTasks.filter((t) => t.projectId === project.id)
                  const completedCount = projectTasks.filter((t) => t.status === 'completed').length
                  return (
                    <div key={project.id} className="p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-slate-900">{project.name}</h4>
                          <p className="text-sm text-slate-600 mt-1">{project.description}</p>
                        </div>
                        <Badge variant={project.status === 'completed' ? 'outline' : 'default'}>{project.progress}%</Badge>
                      </div>
                      <div className="space-y-2">
                        <Progress value={project.progress} className="h-2" />
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{completedCount}/{projectTasks.length} tareas completadas</span>
                          <span>Vence: {new Date(project.endDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <EditProfileDialog open={editProfileOpen} onOpenChange={setEditProfileOpen} />
    </div>
  )
}
