import { useEffect, useState } from 'react'
import { Bell, CheckCheck, Trash2, AlertCircle, CheckCircle2, Clock, UserPlus, MessageSquare, FolderKanban } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead, deleteNotification } from '@/services/api/notifications'
import { useAuth } from '@/context/AuthContext'
import type { Notification } from '@/types'

const typeConfig: Record<string, { icon: React.ReactNode; color: string }> = {
  task_assigned: { icon: <Clock className="w-4 h-4" />, color: 'bg-blue-100 text-blue-600' },
  task_completed: { icon: <CheckCircle2 className="w-4 h-4" />, color: 'bg-green-100 text-green-600' },
  task_overdue: { icon: <AlertCircle className="w-4 h-4" />, color: 'bg-red-100 text-red-600' },
  project_updated: { icon: <FolderKanban className="w-4 h-4" />, color: 'bg-purple-100 text-purple-600' },
  user_added: { icon: <UserPlus className="w-4 h-4" />, color: 'bg-orange-100 text-orange-600' },
  comment_added: { icon: <MessageSquare className="w-4 h-4" />, color: 'bg-teal-100 text-teal-600' },
}

function formatTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Ahora mismo'
  if (mins < 60) return `Hace ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `Hace ${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `Hace ${days}d`
  return new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

export function NotificationsPanel() {
  const { currentUser } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)

  const load = async () => {
    if (!currentUser) return
    const data = await getNotifications(currentUser.id)
    setNotifications(data)
    const count = await getUnreadCount(currentUser.id)
    setUnreadCount(count)
  }

  useEffect(() => {
    if (open) load()
  }, [open, currentUser])

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id)
    load()
  }

  const handleMarkAllAsRead = async () => {
    if (!currentUser) return
    await markAllAsRead(currentUser.id)
    load()
  }

  const handleDelete = async (id: string) => {
    await deleteNotification(id)
    load()
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <Bell className="w-5 h-5 text-slate-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
              {unreadCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-[420px] sm:max-w-[420px] p-0">
        <SheetHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl">Notificaciones</SheetTitle>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={handleMarkAllAsRead}>
                <CheckCheck className="w-4 h-4" />
                Marcar todas como leídas
              </Button>
            )}
          </div>
        </SheetHeader>
        <Separator />
        <ScrollArea className="h-[calc(100vh-120px)]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-sm font-medium text-slate-900">No hay notificaciones</h3>
              <p className="text-sm text-slate-500 mt-1">Estarás al tanto de todo aquí</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((notif) => {
                const config = typeConfig[notif.type] || typeConfig.task_assigned
                return (
                  <div
                    key={notif.id}
                    className={`p-4 flex items-start gap-3 transition-colors ${!notif.read ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
                    onClick={() => handleMarkAsRead(notif.id)}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${config.color}`}>
                      {config.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!notif.read ? 'font-medium text-slate-900' : 'text-slate-600'}`}>{notif.message}</p>
                      <p className="text-xs text-slate-400 mt-1">{formatTime(notif.createdAt)}</p>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity p-1" onClick={(e) => { e.stopPropagation(); handleDelete(notif.id) }}>
                      <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
