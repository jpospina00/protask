import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { Plus, Search, Calendar, Users, TrendingUp, Grid3x3, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProjectDialog } from '@/features/projects/ProjectDialog'
import { useProjects } from '@/context/ProjectContext'
import { useTasks } from '@/context/TaskContext'
import { getUsers } from '@/services/api/users'
import type { User } from '@/types'

export function ProjectsPage() {
  const { projects, loadProjects } = useProjects()
  const { allTasks, loadAllTasks } = useTasks()
  const [users, setUsers] = useState<User[]>([])
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [projectDialogOpen, setProjectDialogOpen] = useState(false)

  useEffect(() => {
    loadProjects()
    loadAllTasks()
    getUsers().then(setUsers)
  }, [loadProjects, loadAllTasks])

  const filteredProjects = projects.filter((project) => {
    if (filter === 'all') return true
    if (filter === 'active') return project.status === 'active'
    if (filter === 'completed') return project.status === 'completed'
    return true
  })

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
      active: { label: 'Activo', variant: 'default' },
      on_hold: { label: 'En Pausa', variant: 'secondary' },
      completed: { label: 'Completado', variant: 'outline' },
    }
    return variants[status] || variants.active
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Proyectos</h1>
          <p className="text-slate-600 mt-1">Gestiona y supervisa todos tus proyectos</p>
        </div>
        <Button className="gap-2" onClick={() => setProjectDialogOpen(true)}>
          <Plus className="w-4 h-4" />Nuevo Proyecto
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input type="text" placeholder="Buscar proyectos..." className="pl-10" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="active">Activos</TabsTrigger>
              <TabsTrigger value="completed">Completados</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-1">
            <Button variant={view === 'grid' ? 'secondary' : 'ghost'} size="sm" onClick={() => setView('grid')}>
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button variant={view === 'list' ? 'secondary' : 'ghost'} size="sm" onClick={() => setView('list')}>
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {view === 'grid' && (
        <div className="grid grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const owner = users.find((u) => u.id === project.owner)
            const projectTasks = allTasks.filter((t) => t.projectId === project.id)
            const completedTasks = projectTasks.filter((t) => t.status === 'completed').length
            const statusBadge = getStatusBadge(project.status)

            return (
              <Link key={project.id} to={`/projects/${project.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                      </div>
                      <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-slate-900">{project.name}</h3>
                      <p className="text-sm text-slate-600 mt-1 line-clamp-2">{project.description}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Progreso</span>
                        <span className="font-semibold text-slate-900">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                    <div className="pt-4 border-t border-slate-200 space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(project.endDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Users className="w-4 h-4" />
                          <span>{project.teamMembers.length} miembros</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-7 h-7">
                            <AvatarImage src={owner?.avatar} />
                            <AvatarFallback>{owner?.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-slate-600">{owner?.name}</span>
                        </div>
                        <span className="text-xs text-slate-500">{completedTasks}/{projectTasks.length} tareas</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}

      {view === 'list' && (
        <div className="space-y-3">
          {filteredProjects.map((project) => {
            const owner = users.find((u) => u.id === project.owner)
            const projectTasks = allTasks.filter((t) => t.projectId === project.id)
            const completedTasks = projectTasks.filter((t) => t.status === 'completed').length
            const statusBadge = getStatusBadge(project.status)
            const teamAvatars = project.teamMembers.slice(0, 4).map((id) => users.find((u) => u.id === id)).filter(Boolean)

            return (
              <Link key={project.id} to={`/projects/${project.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-8 h-8 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg text-slate-900">{project.name}</h3>
                            <p className="text-sm text-slate-600 mt-1">{project.description}</p>
                          </div>
                          <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-6 mt-4">
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Progreso</p>
                            <div className="flex items-center gap-2">
                              <Progress value={project.progress} className="h-2 flex-1" />
                              <span className="text-sm font-semibold text-slate-900">{project.progress}%</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Responsable</p>
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={owner?.avatar} />
                                <AvatarFallback>{owner?.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-slate-900">{owner?.name}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Equipo</p>
                            <div className="flex items-center gap-1">
                              {teamAvatars.map((user) => (
                                <Avatar key={(user as User)?.id} className="w-6 h-6 -ml-2 first:ml-0 border-2 border-white">
                                  <AvatarImage src={(user as User)?.avatar} />
                                  <AvatarFallback>{(user as User)?.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                              ))}
                              {project.teamMembers.length > 4 && (
                                <div className="w-6 h-6 -ml-2 bg-slate-200 rounded-full flex items-center justify-center text-xs font-medium text-slate-600">
                                  +{project.teamMembers.length - 4}
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Tareas</p>
                            <span className="text-sm font-semibold text-slate-900">{completedTasks}/{projectTasks.length}</span>
                            <span className="text-xs text-slate-500 ml-1">completadas</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}

      <ProjectDialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen} />
    </div>
  )
}
