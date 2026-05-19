import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTasks } from '@/context/TaskContext';
import { getUsers } from '@/services/api/users';
import type { User, Task, TaskStatus, TaskPriority } from '@/types';
import { toast } from 'sonner';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
  projectId: string;
}

export function TaskDialog({ open, onOpenChange, task, projectId }: TaskDialogProps) {
  const { createTask, updateTask } = useTasks();
  const [users, setUsers] = useState<User[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setAssignedTo(task.assignedTo);
      setStatus(task.status);
      setPriority(task.priority);
      setDueDate(task.dueDate ? new Date(task.dueDate) : undefined);
    } else {
      resetForm();
    }
  }, [task, open]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setAssignedTo('');
    setStatus('pending');
    setPriority('medium');
    setDueDate(undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !assignedTo || !dueDate) {
      toast.error('Completa todos los campos requeridos');
      return;
    }
    setIsLoading(true);
    try {
      if (task) {
        await updateTask(task.id, {
          title, description, assignedTo, status, priority,
          dueDate: dueDate.toISOString(),
        });
        toast.success('Tarea actualizada');
      } else {
        await createTask({
          title, description, projectId, assignedTo, status, priority,
          dueDate: dueDate.toISOString(),
        });
        toast.success('Tarea creada');
      }
      onOpenChange(false);
      resetForm();
    } catch {
      toast.error('Error al guardar la tarea');
    } finally {
      setIsLoading(false);
    }
  };

  const assignedUser = users.find((u) => u.id === assignedTo);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{task ? 'Editar Tarea' : 'Nueva Tarea'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Diseñar homepage" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe la tarea..." rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Asignar a *</Label>
              <Select value={assignedTo} onValueChange={setAssignedTo}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar usuario">
                    {assignedUser ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={assignedUser.avatar} />
                          <AvatarFallback>{assignedUser.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{assignedUser.name}</span>
                      </div>
                    ) : 'Seleccionar usuario'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{user.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="in_progress">En Progreso</SelectItem>
                  <SelectItem value="completed">Completada</SelectItem>
                  <SelectItem value="overdue">Vencida</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Prioridad</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Fecha de entrega *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? dueDate.toLocaleDateString('es-ES') : 'Seleccionar fecha'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dueDate} onSelect={setDueDate} />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {task && task.comments.length > 0 && (
            <div className="space-y-2">
              <Label>Comentarios</Label>
              <ScrollArea className="h-24 border rounded-lg p-2">
                {task.comments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-2 mb-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={comment.userAvatar} />
                      <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs font-medium">{comment.userName}</p>
                      <p className="text-xs text-slate-600">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? 'Guardando...' : task ? 'Actualizar' : 'Crear'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
