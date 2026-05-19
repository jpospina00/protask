import { useEffect, useState } from 'react'
import { Users, TrendingUp, Clock, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { getUsers } from '@/services/api/users'
import { useTasks } from '@/context/TaskContext'
import { useProjects } from '@/context/ProjectContext'
import type { User } from '@/types'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export function WorkloadPage() {
  const { allTasks, loadAllTasks } = useTasks()
  const { projects, loadProjects } = useProjects()
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    loadAllTasks()
    loadProjects()
    getUsers().then(setUsers)
  }, [loadAllTasks, loadProjects])

  const userWorkload = users.map((user) => {
    const userTasks = allTasks.filter((t) => t.assignedTo === user.id)
    return {
      user,
      total: userTasks.length,
      pending: userTasks.filter((t) => t.status === 'pending').length,
      inProgress: userTasks.filter((t) => t.status === 'in_progress').length,
      completed: userTasks.filter((t) => t.status === 'completed').length,
      overdue: userTasks.filter((t) => t.status === 'overdue').length,
      tasks: userTasks,
    }
  })

  const chartData = userWorkload.map((w) => ({
    name: w.user.name.split(' ')[0],
    Pendiente: w.pending,
    'En Progreso': w.inProgress,
    Completadas: w.completed,
    Vencidas: w.overdue,
  }))

  const totalTasks = allTasks.length
  const avgTasksPerUser = users.length > 0 ? Math.round(totalTasks / users.length) : 0
  const mostBusyUser = userWorkload.length > 0 ? userWorkload.reduce((max, user) => user.total > max.total ? user : max) : null

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Carga de Trabajo</h1>
        <p className="text-slate-600 mt-1">Visualiza la distribución de tareas por miembro del equipo</p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total de Tareas</CardTitle>
            <Users className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{totalTasks}</div>
            <p className="text-xs text-slate-500 mt-1">Entre {users.length} miembros del equipo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Promedio por Persona</CardTitle>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{avgTasksPerUser}</div>
            <p className="text-xs text-slate-500 mt-1">Tareas asignadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Mayor Carga</CardTitle>
            <AlertCircle className="w-5 h-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{mostBusyUser ? mostBusyUser.total : 0}</div>
            <p className="text-xs text-slate-500 mt-1">{mostBusyUser ? mostBusyUser.user.name : 'N/A'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">En Progreso Total</CardTitle>
            <Clock className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{allTasks.filter((t) => t.status === 'in_progress').length}</div>
            <p className="text-xs text-slate-500 mt-1">Tareas en desarrollo</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Distribución por Usuario</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="Pendiente" stackId="a" fill="#94a3b8" />
              <Bar dataKey="En Progreso" stackId="a" fill="#3b82f6" />
              <Bar dataKey="Completadas" stackId="a" fill="#10b981" />
              <Bar dataKey="Vencidas" stackId="a" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {userWorkload.map(({ user, total, pending, inProgress, completed, overdue }) => {
          const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
          const userProjects = projects.filter((p) => p.teamMembers.includes(user.id))

          return (
            <Card key={user.id}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-lg">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{user.name}</h3>
                    <p className="text-sm text-slate-600">{user.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">{total}</p>
                    <p className="text-xs text-slate-500">tareas asignadas</p>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-4 items-center">
                  <div className="col-span-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-600">Completitud</span>
                      <span className="font-medium">{completionRate}%</span>
                    </div>
                    <Progress value={completionRate} className="h-2" />
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Badge className="bg-slate-100 text-slate-700">{pending} Pend.</Badge>
                    <Badge className="bg-blue-100 text-blue-700">{inProgress} Prog.</Badge>
                    <Badge className="bg-green-100 text-green-700">{completed} Comp.</Badge>
                    <Badge className="bg-red-100 text-red-700">{overdue} Venc.</Badge>
                  </div>
                  <div className="flex gap-1 justify-end">
                    {userProjects.slice(0, 3).map((p) => (
                      <Badge key={p.id} variant="outline" className="text-xs">{p.name}</Badge>
                    ))}
                    {userProjects.length > 3 && (
                      <span className="text-xs text-slate-500">+{userProjects.length - 3}</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
