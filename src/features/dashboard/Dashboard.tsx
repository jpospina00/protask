import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Clock, CheckCircle2, AlertCircle, FolderKanban, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useProjects } from '@/context/ProjectContext'
import { useTasks } from '@/context/TaskContext'
import { getUsers } from '@/services/api/users'
import type { User } from '@/types'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export function Dashboard() {
  const { projects, loadProjects } = useProjects()
  const { allTasks, loadAllTasks } = useTasks()
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    loadProjects()
    loadAllTasks()
    getUsers().then(setUsers)
  }, [loadProjects, loadAllTasks])

  const activeProjects = projects.filter((p) => p.status === 'active').length
  const completedTasks = allTasks.filter((t) => t.status === 'completed').length
  const overdueTasks = allTasks.filter((t) => t.status === 'overdue')
  const inProgressTasks = allTasks.filter((t) => t.status === 'in_progress').length

  const workloadData = users.map((user) => ({
    name: user.name.split(' ')[0],
    tasks: allTasks.filter((t) => t.assignedTo === user.id).length,
  }))

  const tasksByStatus = [
    { name: 'Pendiente', value: allTasks.filter((t) => t.status === 'pending').length, color: '#94a3b8' },
    { name: 'En Progreso', value: inProgressTasks, color: '#3b82f6' },
    { name: 'Completadas', value: completedTasks, color: '#10b981' },
    { name: 'Vencidas', value: overdueTasks.length, color: '#ef4444' },
  ]

  const activeProjectsList = projects
    .filter((p) => p.status === 'active')
    .sort((a, b) => a.progress - b.progress)
    .slice(0, 5)

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Resumen general de tus proyectos y tareas</p>
        </div>
        <Link to="/projects">
          <Button className="gap-2"><Plus className="w-4 h-4" />Nuevo Proyecto</Button>
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Proyectos Activos</CardTitle>
            <FolderKanban className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{activeProjects}</div>
            <p className="text-xs text-slate-500 mt-1">+2 desde el mes pasado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">En Progreso</CardTitle>
            <Clock className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{inProgressTasks}</div>
            <p className="text-xs text-slate-500 mt-1">Tareas actualmente en desarrollo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Completadas</CardTitle>
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{completedTasks}</div>
            <p className="text-xs text-slate-500 mt-1">{allTasks.length > 0 ? Math.round((completedTasks / allTasks.length) * 100) : 0}% del total</p>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Tareas Vencidas</CardTitle>
            <AlertCircle className="w-5 h-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-700">{overdueTasks.length}</div>
            <p className="text-xs text-red-600 mt-1">Requieren atención inmediata</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Proyectos Activos</CardTitle>
              <Link to="/projects"><Button variant="ghost" size="sm">Ver todos</Button></Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeProjectsList.map((project) => {
                const owner = users.find((u) => u.id === project.owner)
                const tasksCount = allTasks.filter((t) => t.projectId === project.id).length
                const completedCount = allTasks.filter((t) => t.projectId === project.id && t.status === 'completed').length

                return (
                  <Link key={project.id} to={`/projects/${project.id}`}>
                    <div className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900">{project.name}</h3>
                          <p className="text-sm text-slate-600 mt-1">{project.description}</p>
                        </div>
                        <Badge variant={project.progress >= 70 ? 'default' : project.progress >= 40 ? 'secondary' : 'outline'}>
                          {project.progress}%
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <Progress value={project.progress} className="h-2" />
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={owner?.avatar} />
                              <AvatarFallback>{owner?.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{owner?.name}</span>
                          </div>
                          <span>{completedCount}/{tasksCount} tareas completadas</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Carga de Trabajo por Usuario</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={workloadData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                  <Bar dataKey="tasks" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Distribución de Tareas</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={tasksByStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                    {tasksByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {tasksByStatus.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-slate-600">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-slate-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-700 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />Tareas Vencidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {overdueTasks.length === 0 ? (
                <p className="text-sm text-slate-600 text-center py-4">¡Excelente! No hay tareas vencidas</p>
              ) : (
                overdueTasks.slice(0, 5).map((task) => {
                  const assignedUser = users.find((u) => u.id === task.assignedTo)
                  const project = projects.find((p) => p.id === task.projectId)
                  return (
                    <div key={task.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <h4 className="font-medium text-slate-900 text-sm">{task.title}</h4>
                      <p className="text-xs text-slate-600 mt-1">{project?.name}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-5 h-5">
                            <AvatarImage src={assignedUser?.avatar} />
                            <AvatarFallback>{assignedUser?.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-slate-600">{assignedUser?.name}</span>
                        </div>
                        <span className="text-xs text-red-600 font-medium">Vencida: {task.dueDate}</span>
                      </div>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
