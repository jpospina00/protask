import { cva } from 'class-variance-authority'
import { cn } from '@/components/ui/utils'
import type { TaskStatus, TaskPriority, ProjectStatus } from '@/types'

const statusVariants = cva('', {
  variants: {
    status: {
      pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
      in_progress: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
      completed: 'bg-green-100 text-green-800 hover:bg-green-100',
      overdue: 'bg-red-100 text-red-800 hover:bg-red-100',
      active: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
      on_hold: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
    },
  },
})

const priorityVariants = cva('', {
  variants: {
    priority: {
      low: 'bg-gray-100 text-gray-600 hover:bg-gray-100',
      medium: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
      high: 'bg-red-100 text-red-800 hover:bg-red-100',
    },
  },
})

const labels: Record<string, string> = {
  pending: 'Pendiente',
  in_progress: 'En Progreso',
  completed: 'Completada',
  overdue: 'Vencida',
  active: 'Activo',
  on_hold: 'En Pausa',
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
}

interface StatusBadgeProps {
  type: 'status' | 'priority'
  value: TaskStatus | TaskPriority | ProjectStatus
}

export function StatusBadge({ type, value }: StatusBadgeProps) {
  const variantClass =
    type === 'priority'
      ? priorityVariants({ priority: value as TaskPriority })
      : statusVariants({ status: value as TaskStatus | 'active' | 'on_hold' })

  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', variantClass)}>
      {labels[value] ?? value}
    </span>
  )
}
