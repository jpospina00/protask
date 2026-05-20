import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/components/ui/utils'

interface MetricCardProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  variant?: 'default' | 'danger'
}

export function MetricCard({ label, value, icon, variant = 'default' }: MetricCardProps) {
  return (
    <Card className={cn(variant === 'danger' && 'border-red-200 bg-red-50')}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className={cn('text-2xl font-bold', variant === 'danger' && 'text-red-600')}>
              {value}
            </p>
          </div>
          {icon && (
            <div className={cn('rounded-full p-2', variant === 'danger' ? 'bg-red-100 text-red-600' : 'bg-primary/10')}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
