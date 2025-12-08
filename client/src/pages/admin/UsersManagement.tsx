import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Plus, Search, Edit, Trash2, User, Shield, ShieldCheck, Clock } from 'lucide-react';
import type { AdminUser } from '@shared/schema';

type SafeAdminUser = Omit<AdminUser, 'password'>;

export default function UsersManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<SafeAdminUser | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: users = [], isLoading } = useQuery<SafeAdminUser[]>({
    queryKey: ['/api/admin/users'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: { username: string; password: string; fullName: string; role: string; isActive: boolean }) => {
      return await apiRequest('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      setIsCreateDialogOpen(false);
      toast({
        title: 'Успешно',
        description: 'Пользователь создан',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось создать пользователя',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<{ username: string; password: string; fullName: string; role: string; isActive: boolean }> }) => {
      return await apiRequest(`/api/admin/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      setIsEditDialogOpen(false);
      setSelectedUser(null);
      toast({
        title: 'Успешно',
        description: 'Пользователь обновлен',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось обновить пользователя',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      toast({
        title: 'Успешно',
        description: 'Пользователь удален',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось удалить пользователя',
        variant: 'destructive',
      });
    },
  });

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.fullName && user.fullName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      username: formData.get('username') as string,
      password: formData.get('password') as string,
      fullName: formData.get('fullName') as string,
      role: formData.get('role') as string || 'manager',
      isActive: true,
    };
    createMutation.mutate(data);
  };

  const handleEdit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedUser) return;
    
    const formData = new FormData(event.currentTarget);
    const password = formData.get('password') as string;
    const data: any = {
      username: formData.get('username') as string,
      fullName: formData.get('fullName') as string,
      role: formData.get('role') as string,
      isActive: formData.get('isActive') === 'on',
    };
    
    if (password && password.trim() !== '') {
      data.password = password;
    }
    
    updateMutation.mutate({ id: selectedUser.id, data });
  };

  const getRoleColor = (role: string | null) => {
    if (!role) return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'manager': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getRoleLabel = (role: string | null) => {
    if (!role) return 'Неизвестно';
    switch (role) {
      case 'admin': return 'Администратор';
      case 'manager': return 'Менеджер';
      default: return role;
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Никогда';
    return new Date(date).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Загрузка пользователей...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Управление пользователями</h1>
          <p className="text-muted-foreground">Создание, редактирование и удаление пользователей системы</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-user">
              <Plus className="w-4 h-4 mr-2" />
              Добавить пользователя
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Новый пользователь</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Логин *</Label>
                <Input 
                  id="username" 
                  name="username" 
                  required 
                  data-testid="input-username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Пароль *</Label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  required 
                  data-testid="input-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Полное имя</Label>
                <Input 
                  id="fullName" 
                  name="fullName"
                  data-testid="input-fullname"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Роль</Label>
                <Select name="role" defaultValue="manager">
                  <SelectTrigger data-testid="select-role">
                    <SelectValue placeholder="Выберите роль" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Администратор</SelectItem>
                    <SelectItem value="manager">Менеджер</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit" disabled={createMutation.isPending} data-testid="button-submit-create">
                  {createMutation.isPending ? 'Создание...' : 'Создать'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Поиск по имени или логину..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="input-search-users"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="relative" data-testid={`card-user-${user.id}`}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    {user.role === 'admin' ? (
                      <ShieldCheck className="w-5 h-5 text-red-600" />
                    ) : (
                      <User className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{user.fullName || user.username}</CardTitle>
                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                  </div>
                </div>
                <Badge className={getRoleColor(user.role)}>
                  {getRoleLabel(user.role)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Последний вход:</span>
                <span>{formatDate(user.lastLogin)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant={user.isActive ? "default" : "secondary"}>
                  {user.isActive ? 'Активен' : 'Заблокирован'}
                </Badge>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedUser(user);
                    setIsEditDialogOpen(true);
                  }}
                  data-testid={`button-edit-user-${user.id}`}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Редактировать
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedUser(user);
                    setIsDeleteDialogOpen(true);
                  }}
                  data-testid={`button-delete-user-${user.id}`}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Удалить
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">Пользователи не найдены</h3>
          <p className="text-muted-foreground">
            {searchQuery ? 'Попробуйте изменить параметры поиска' : 'Создайте первого пользователя'}
          </p>
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) setSelectedUser(null);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать пользователя</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <form onSubmit={handleEdit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-username">Логин</Label>
                <Input 
                  id="edit-username" 
                  name="username" 
                  defaultValue={selectedUser.username}
                  required
                  data-testid="input-edit-username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-password">Новый пароль (оставьте пустым, чтобы не менять)</Label>
                <Input 
                  id="edit-password" 
                  name="password" 
                  type="password"
                  placeholder="Введите новый пароль..."
                  data-testid="input-edit-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-fullName">Полное имя</Label>
                <Input 
                  id="edit-fullName" 
                  name="fullName"
                  defaultValue={selectedUser.fullName || ''}
                  data-testid="input-edit-fullname"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Роль</Label>
                <Select name="role" defaultValue={selectedUser.role || 'manager'}>
                  <SelectTrigger data-testid="select-edit-role">
                    <SelectValue placeholder="Выберите роль" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Администратор</SelectItem>
                    <SelectItem value="manager">Менеджер</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Switch 
                  id="edit-isActive" 
                  name="isActive" 
                  defaultChecked={selectedUser.isActive ?? true}
                  data-testid="switch-edit-active"
                />
                <Label htmlFor="edit-isActive">Активен</Label>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit" disabled={updateMutation.isPending} data-testid="button-submit-edit">
                  {updateMutation.isPending ? 'Сохранение...' : 'Сохранить'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => {
        setIsDeleteDialogOpen(open);
        if (!open) setSelectedUser(null);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить пользователя?</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <p>
                Вы уверены, что хотите удалить пользователя{' '}
                <strong>{selectedUser.fullName || selectedUser.username}</strong>?
              </p>
              <p className="text-sm text-muted-foreground">
                Это действие нельзя отменить.
              </p>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Отмена
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => deleteMutation.mutate(selectedUser.id)}
                  disabled={deleteMutation.isPending}
                  data-testid="button-confirm-delete"
                >
                  {deleteMutation.isPending ? 'Удаление...' : 'Удалить'}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
