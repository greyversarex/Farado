import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Plus, Search, Edit, Trash2, User, Building, Mail, Phone, MapPin, CreditCard } from 'lucide-react';
import type { Counterparty, InsertCounterparty } from '@shared/schema';

export default function Counterparties() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCounterparty, setSelectedCounterparty] = useState<Counterparty | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: counterparties = [], isLoading } = useQuery<Counterparty[]>({
    queryKey: ['/api/admin/counterparties'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertCounterparty) => {
      return await apiRequest('/api/admin/counterparties', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/counterparties'] });
      setIsCreateDialogOpen(false);
      toast({
        title: 'Успешно',
        description: 'Контрагент создан',
      });
    },
    onError: (error) => {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать контрагента',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Counterparty> }) => {
      return await apiRequest(`/api/admin/counterparties/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/counterparties'] });
      setIsEditDialogOpen(false);
      setSelectedCounterparty(null);
      toast({
        title: 'Успешно',
        description: 'Контрагент обновлен',
      });
    },
    onError: (error) => {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить контрагента',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/admin/counterparties/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/counterparties'] });
      toast({
        title: 'Успешно',
        description: 'Контрагент удален',
      });
    },
    onError: (error) => {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить контрагента',
        variant: 'destructive',
      });
    },
  });

  const filteredCounterparties = (counterparties as Counterparty[]).filter((counterparty: Counterparty) =>
    counterparty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (counterparty.company && counterparty.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (counterparty.email && counterparty.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data: InsertCounterparty = {
      name: formData.get('name') as string,
      company: formData.get('company') as string || undefined,
      email: formData.get('email') as string || undefined,
      phone: formData.get('phone') as string || undefined,
      address: formData.get('address') as string || undefined,
      taxId: formData.get('taxId') as string || undefined,
      type: formData.get('type') as string || 'client',
      creditLimit: formData.get('creditLimit') as string || '0',
      comments: formData.get('comments') as string || undefined,
    };
    console.log('Creating counterparty with data:', data);
    createMutation.mutate(data);
  };

  const handleEdit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedCounterparty) return;
    
    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get('name') as string,
      company: formData.get('company') as string || undefined,
      email: formData.get('email') as string || undefined,
      phone: formData.get('phone') as string || undefined,
      address: formData.get('address') as string || undefined,
      taxId: formData.get('taxId') as string || undefined,
      type: formData.get('type') as string,
      creditLimit: formData.get('creditLimit') as string,
      comments: formData.get('comments') as string || undefined,
    };
    updateMutation.mutate({ id: selectedCounterparty.id, data });
  };

  const getTypeColor = (type: string | null) => {
    if (!type) return 'bg-gray-100 text-gray-800';
    switch (type) {
      case 'client': return 'bg-blue-100 text-blue-800';
      case 'supplier': return 'bg-green-100 text-green-800';
      case 'both': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string | null) => {
    if (!type) return 'Неизвестно';
    switch (type) {
      case 'client': return 'Клиент';
      case 'supplier': return 'Поставщик';
      case 'both': return 'Клиент/Поставщик';
      default: return type;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Загрузка контрагентов...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-3">
        <h1 className="font-bold text-[26px]">Контрагенты</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Добавить контрагента
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Новый контрагент</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Имя *</Label>
                  <Input id="name" name="name" required />
                </div>
                <div>
                  <Label htmlFor="company">Компания</Label>
                  <Input id="company" name="company" />
                </div>
                <div>
                  <Label htmlFor="phone">Телефон</Label>
                  <Input id="phone" name="phone" />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="comments">Комментарии</Label>
                  <Textarea id="comments" name="comments" rows={3} />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Создание...' : 'Создать'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Поиск контрагентов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCounterparties.map((counterparty: Counterparty) => (
          <Card 
            key={counterparty.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => {
              console.log('Clicked counterparty:', counterparty.id);
              window.location.href = `/admin/counterparty/${counterparty.id}`;
            }}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{counterparty.name}</CardTitle>
                  {counterparty.company && (
                    <p className="text-sm text-gray-600 mt-1">{counterparty.company}</p>
                  )}
                </div>
                <Badge className={getTypeColor(counterparty.type)}>
                  {getTypeLabel(counterparty.type)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {counterparty.email && (
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {counterparty.email}
                </div>
              )}
              {counterparty.phone && (
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {counterparty.phone}
                </div>
              )}
              {counterparty.address && (
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {counterparty.address}
                </div>
              )}
              {counterparty.creditLimit && parseFloat(counterparty.creditLimit) > 0 && (
                <div className="flex items-center text-sm text-gray-600">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Лимит: ${counterparty.creditLimit}
                </div>
              )}
              <div className="flex justify-end space-x-2 pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCounterparty(counterparty);
                    setIsEditDialogOpen(true);
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Вы уверены, что хотите удалить контрагента "${counterparty.name}"?`)) {
                      deleteMutation.mutate(counterparty.id);
                    }
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Редактировать контрагента</DialogTitle>
          </DialogHeader>
          {selectedCounterparty && (
            <form onSubmit={handleEdit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Имя *</Label>
                  <Input id="edit-name" name="name" defaultValue={selectedCounterparty.name} required />
                </div>
                <div>
                  <Label htmlFor="edit-company">Компания</Label>
                  <Input id="edit-company" name="company" defaultValue={selectedCounterparty.company || ''} />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input id="edit-email" name="email" type="email" defaultValue={selectedCounterparty.email || ''} />
                </div>
                <div>
                  <Label htmlFor="edit-phone">Телефон</Label>
                  <Input id="edit-phone" name="phone" defaultValue={selectedCounterparty.phone || ''} />
                </div>
                <div>
                  <Label htmlFor="edit-taxId">ИНН</Label>
                  <Input id="edit-taxId" name="taxId" defaultValue={selectedCounterparty.taxId || ''} />
                </div>
                <div>
                  <Label htmlFor="edit-type">Тип</Label>
                  <select name="type" defaultValue={selectedCounterparty.type || "client"} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="client">Клиент</option>
                    <option value="supplier">Поставщик</option>
                    <option value="both">Клиент/Поставщик</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="edit-address">Адрес</Label>
                  <Input id="edit-address" name="address" defaultValue={selectedCounterparty.address || ''} />
                </div>
                <div>
                  <Label htmlFor="edit-creditLimit">Кредитный лимит</Label>
                  <Input 
                    id="edit-creditLimit" 
                    name="creditLimit" 
                    type="number" 
                    step="0.01" 
                    defaultValue={selectedCounterparty.creditLimit || "0"} 
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="edit-comments">Комментарии</Label>
                  <Textarea 
                    id="edit-comments" 
                    name="comments" 
                    rows={3} 
                    defaultValue={selectedCounterparty.comments || ''} 
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Сохранение...' : 'Сохранить'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
      {filteredCounterparties.length === 0 && (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Контрагенты не найдены</h3>
          <p className="text-gray-500">
            {searchQuery ? 'Попробуйте изменить поисковый запрос' : 'Начните с создания первого контрагента'}
          </p>
        </div>
      )}
    </div>
  );
}