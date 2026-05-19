import { useState, useEffect } from 'react';
import { X, Search, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { getUsers } from '@/services/api/users';
import type { User } from '@/types';

interface AddCollaboratorsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCollaborators: string[];
  onAdd: (userIds: string[]) => void;
}

export function AddCollaboratorsDialog({ open, onOpenChange, currentCollaborators, onAdd }: AddCollaboratorsDialogProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  useEffect(() => {
    if (open) setSelected([]);
  }, [open]);

  const availableUsers = users.filter(
    (u) => !currentCollaborators.includes(u.id) && (u.name.toLowerCase().includes(search.toLowerCase()) || u.role.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleUser = (userId: string) => {
    setSelected((prev) => prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]);
  };

  const handleAdd = () => {
    onAdd(selected);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Añadir Colaboradores</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Buscar por nombre, rol o email..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {selected.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {selected.map((id) => {
              const user = users.find((u) => u.id === id);
              return user ? (
                <Badge key={id} variant="secondary" className="gap-1">
                  {user.name}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => toggleUser(id)} />
                </Badge>
              ) : null;
            })}
          </div>
        )}

        <ScrollArea className="h-64">
          <div className="space-y-1">
            {availableUsers.map((user) => {
              const isSelected = selected.includes(user.id);
              return (
                <div key={user.id} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50 border border-transparent'}`} onClick={() => toggleUser(user.id)}>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.role} - {user.email}</p>
                  </div>
                  {isSelected && <Check className="w-5 h-5 text-blue-600" />}
                </div>
              );
            })}
            {availableUsers.length === 0 && <p className="text-sm text-slate-500 text-center py-8">No se encontraron usuarios</p>}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleAdd} disabled={selected.length === 0}>
            Añadir ({selected.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
