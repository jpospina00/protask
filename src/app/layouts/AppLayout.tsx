import { useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router'
import { LayoutDashboard, FolderKanban, Users, User, Search, LogOut } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { NotificationsPanel } from '@/features/notifications/NotificationsPanel'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'

export function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser, isAuthenticated, logout } = useAuth()

  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      navigate('/login', { replace: true })
    }
  }, [isAuthenticated, currentUser, navigate])

  if (!isAuthenticated || !currentUser) return null

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Proyectos', href: '/projects', icon: FolderKanban },
    { name: 'Carga de Trabajo', href: '/workload', icon: Users },
    { name: 'Mi Perfil', href: '/profile', icon: User },
  ]

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const handleLogout = () => {
    logout()
    toast.success('Sesión cerrada', { description: 'Has cerrado sesión correctamente' })
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-bold text-slate-900">ProTask</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  active ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 px-4 py-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{currentUser.name}</p>
              <p className="text-xs text-slate-500 truncate">{currentUser.role}</p>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200">
          <Button variant="ghost" className="w-full justify-start gap-3 text-slate-600 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Cerrar Sesión</span>
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input type="text" placeholder="Buscar proyectos, tareas o personas..." className="pl-10" />
              </div>
            </div>
            <div className="flex items-center">
              <NotificationsPanel />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
