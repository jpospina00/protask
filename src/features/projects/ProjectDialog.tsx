import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useProjects } from '@/context/ProjectContext';
import { getUsers } from '@/services/api/users';
import type { User, Project, ProjectStatus } from '@/types';
import { toast } from 'sonner';

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project;
}

export function ProjectDialog({ open, onOpenChange, project }: ProjectDialogProps) {
  const { createProject, updateProject } = useProjects();
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [owner, setOwner] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('active');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description);
      setOwner(project.owner);
      setStatus(project.status);
      setStartDate(project.startDate ? new Date(project.startDate) : undefined);
      setEndDate(project.endDate ? new Date(project.endDate) : undefined);
      setSelectedMembers(project.teamMembers);
    } else {
      resetForm();
    }
  }, [project, open]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setOwner('');
    setStatus('active');
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedMembers([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !owner || !endDate) {
      toast.error('Completa todos los campos requeridos');
      return;
    }
    setIsLoading(true);
    try {
      if (project) {
        await updateProject(project.id, {
          name, description, owner, status,
          startDate: startDate?.toISOString() || '',
          endDate: endDate.toISOString(),
          teamMembers: selectedMembers,
        });
        toast.success('Proyecto actualizado');
      } else {
        await createProject({
          name, description, owner, status, progress: 0,
          startDate: startDate?.toISOString() || new Date().toISOString(),
          endDate: endDate.toISOString(),
          teamMembers: selectedMembers,
        });
        toast.success('Proyecto creado');
      }
      onOpenChange(false);
      resetForm();
    } catch {
      toast.error('Error al guardar el proyecto');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMember = (userId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{project ? 'Editar Proyecto' : 'Nuevo Proyecto'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del proyecto *</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Rediseño Web" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe el proyecto..." rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Responsable *</Label>
              <Select value={owner} onValueChange={setOwner}>
                <SelectTrigger><SelectValue placeholder="Seleccionar responsable" /></SelectTrigger>
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
              <Select value={status} onValueChange={(v) => setStatus(v as ProjectStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="on_hold">En Pausa</SelectItem>
                  <SelectItem value="completed">Completado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha de inicio</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? startDate.toLocaleDateString('es-ES') : 'Seleccionar fecha'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Fecha de entrega *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? endDate.toLocaleDateString('es-ES') : 'Seleccionar fecha'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Miembros del equipo</Label>
            <ScrollArea className="h-32 border rounded-lg p-2">
              <div className="space-y-1">
                {users.map((user) => {
                  const isSelected = selectedMembers.includes(user.id);
                  return (
                    <div key={user.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer" onClick={() => toggleMember(user.id)}>
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.role}</p>
                      </div>
                      {isSelected && <Badge variant="default">Seleccionado</Badge>}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
            {selectedMembers.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedMembers.map((id) => {
                  const user = users.find((u) => u.id === id);
                  return user ? (
                    <Badge key={id} variant="secondary" className="gap-1">
                      {user.name}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => toggleMember(id)} />
                    </Badge>
                  ) : null;
                })}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? 'Guardando...' : project ? 'Actualizar' : 'Crear'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
