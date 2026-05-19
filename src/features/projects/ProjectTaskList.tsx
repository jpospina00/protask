import { useState } from 'react'
import { Calendar, Circle, Clock, CheckCircle2, AlertCircle, Edit, Trash2, MoreVertical } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import type { Task, TaskStatus } from '@/types'

interface ProjectTaskListProps {
  tasks: Task[]
  users: { id: string; name: string; avatar: string }[]
  onEditTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
}

const statusIcons: Record<TaskStatus, React.ReactNode> = {
  pending: <Circle className="w-4 h-4 text-slate-400" />,
  in_progress: <Clock className="w-4 h-4 text-blue-500" />,
  completed: <CheckCircle2 className="w-4 h-4 text-green-500" />,
  overdue: <AlertCircle className="w-4 h-4 text-red-500" />,
}

const statusLabels: Record<TaskStatus, string> = {
  pending: 'Pendiente',
  in_progress: 'En Progreso',
  completed: 'Completada',
  overdue: 'Vencida',
}

const statusColors: Record<TaskStatus, string> = {
  pending: 'bg-slate-100 text-slate-700',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700',
}

const priorityLabels: Record<string, string> = { low: 'Baja', medium: 'Media', high: 'Alta' }

export function ProjectTaskList({ tasks, users, onEditTask, onDeleteTask }: ProjectTaskListProps) {
  const [filter, setFilter] = useState<'all' | TaskStatus>('all')

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true
    return task.status === filter
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Tareas ({filteredTasks.length})</CardTitle>
          <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <TabsList>
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="pending">Pendientes</TabsTrigger>
              <TabsTrigger value="in_progress">En Progreso</TabsTrigger>
              <TabsTrigger value="completed">Completadas</TabsTrigger>
              <TabsTrigger value="overdue">Vencidas</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">No hay tareas en esta categoría</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const assignedUser = users.find((u) => u.id === task.assignedTo)
            return (
              <div key={task.id} className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/30 transition-colors">
                <div className="flex-shrink-0">{statusIcons[task.status]}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-slate-900">{task.title}</h4>
                    <Badge variant="outline" className={`text-xs ${task.priority === 'high' ? 'text-red-600' : task.priority === 'medium' ? 'text-yellow-600' : 'text-slate-600'}`}>
                      {priorityLabels[task.priority]}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-1">{task.description}</p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-7 h-7">
                      <AvatarImage src={assignedUser?.avatar} />
                      <AvatarFallback>{assignedUser?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-slate-600">{assignedUser?.name}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(task.dueDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                  </div>

                  <Badge className={statusColors[task.status]}>{statusLabels[task.status]}</Badge>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditTask(task)}>
                        <Edit className="w-4 h-4 mr-2" />Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={() => onDeleteTask(task.id)}>
                        <Trash2 className="w-4 h-4 mr-2" />Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
