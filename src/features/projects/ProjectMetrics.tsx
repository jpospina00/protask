import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, CheckCircle2, Clock, AlertCircle } from 'lucide-react'

interface ProjectMetricsProps {
  progress: number
  completed: number
  inProgress: number
  overdue: number
  total: number
}

export function ProjectMetrics({ progress, completed, inProgress, overdue, total }: ProjectMetricsProps) {
  return (
    <div className="grid grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Progreso</p>
              <p className="text-2xl font-bold text-slate-900">{progress}%</p>
            </div>
          </div>
          <Progress value={progress} className="h-2 mt-4" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Completadas</p>
              <p className="text-2xl font-bold text-slate-900">{completed}/{total}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">En Progreso</p>
              <p className="text-2xl font-bold text-slate-900">{inProgress}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={overdue > 0 ? 'border-red-200' : ''}>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Vencidas</p>
              <p className="text-2xl font-bold text-slate-900">{overdue}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
