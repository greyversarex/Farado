import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Plus, Search, Edit, Trash2, Warehouse as WarehouseIcon, MapPin, Package, DollarSign, Gauge } from 'lucide-react';
import type { Warehouse, InsertWarehouse } from '@shared/schema';

export default function Warehouses() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: warehouses = [], isLoading } = useQuery({
    queryKey: ['/api/admin/warehouses'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertWarehouse) => {
      return await apiRequest('/api/admin/warehouses', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/warehouses'] });
      setIsCreateDialogOpen(false);
      toast({
        title: 'Успешно',
        description: 'Склад создан',
      });
    },
    onError: (error) => {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать склад',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Warehouse> }) => {
      return await apiRequest(`/api/admin/warehouses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/warehouses'] });
      setIsEditDialogOpen(false);
      setSelectedWarehouse(null);
      toast({
        title: 'Успешно',
        description: 'Склад обновлен',
      });
    },
    onError: (error) => {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить склад',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/admin/warehouses/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/warehouses'] });
      toast({
        title: 'Успешно',
        description: 'Склад удален',
      });
    },
    onError: (error) => {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить склад',
        variant: 'destructive',
      });
    },
  });

  const filteredWarehouses = warehouses.filter((warehouse: Warehouse) =>
    warehouse.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    warehouse.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data: InsertWarehouse = {
      name: formData.get('name') as string,
      location: formData.get('location') as string || undefined,
      address: formData.get('address') as string || undefined,
    };
    createMutation.mutate(data);
  };

  const handleEdit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedWarehouse) return;
    
    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get('name') as string,
      location: formData.get('location') as string || undefined,
      address: formData.get('address') as string || undefined,
    };
    updateMutation.mutate({ id: selectedWarehouse.id, data });
  };

  const formatCurrency = (amount: string | null) => {
    if (!amount || amount === '0') return '$0';
    return `$${parseFloat(amount).toLocaleString()}`;
  };

  const formatVolume = (volume: string | null) => {
    if (!volume || volume === '0') return '0 м³';
    return `${parseFloat(volume).toFixed(2)} м³`;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Загрузка складов...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Склады</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Добавить склад
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Новый склад</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label htmlFor="name">Название *</Label>
                <Input id="name" name="name" required />
              </div>
              <div>
                <Label htmlFor="location">Местоположение</Label>
                <Input id="location" name="location" />
              </div>
              <div>
                <Label htmlFor="address">Адрес</Label>
                <Textarea id="address" name="address" rows={3} />
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
            placeholder="Поиск складов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWarehouses.map((warehouse: Warehouse) => (
          <Card key={warehouse.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center">
                    <WarehouseIcon className="w-5 h-5 mr-2 text-blue-600" />
                    {warehouse.name}
                  </CardTitle>
                  {warehouse.location && (
                    <p className="text-sm text-gray-600 mt-1">{warehouse.location}</p>
                  )}
                </div>
                <Badge className={warehouse.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {warehouse.isActive ? 'Активен' : 'Неактивен'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {warehouse.address && (
                <div className="flex items-start text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{warehouse.address}</span>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-center">
                  <div className="flex items-center justify-center text-gray-600 mb-1">
                    <Package className="w-4 h-4 mr-1" />
                  </div>
                  <div className="font-semibold">{warehouse.totalItems || 0}</div>
                  <div className="text-xs text-gray-500">Товаров</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center text-gray-600 mb-1">
                    <Gauge className="w-4 h-4 mr-1" />
                  </div>
                  <div className="font-semibold">{formatVolume(warehouse.totalVolume)}</div>
                  <div className="text-xs text-gray-500">Объем</div>
                </div>
              </div>
              
              <div className="text-center pt-2 border-t">
                <div className="flex items-center justify-center text-gray-600 mb-1">
                  <DollarSign className="w-4 h-4 mr-1" />
                </div>
                <div className="font-semibold text-lg">{formatCurrency(warehouse.totalValue)}</div>
                <div className="text-xs text-gray-500">Общая стоимость</div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedWarehouse(warehouse);
                    setIsEditDialogOpen(true);
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteMutation.mutate(warehouse.id)}
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Редактировать склад</DialogTitle>
          </DialogHeader>
          {selectedWarehouse && (
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Название *</Label>
                <Input id="edit-name" name="name" defaultValue={selectedWarehouse.name} required />
              </div>
              <div>
                <Label htmlFor="edit-location">Местоположение</Label>
                <Input id="edit-location" name="location" defaultValue={selectedWarehouse.location || ''} />
              </div>
              <div>
                <Label htmlFor="edit-address">Адрес</Label>
                <Textarea id="edit-address" name="address" rows={3} defaultValue={selectedWarehouse.address || ''} />
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

      {filteredWarehouses.length === 0 && (
        <div className="text-center py-12">
          <WarehouseIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Склады не найдены</h3>
          <p className="text-gray-500">
            {searchQuery ? 'Попробуйте изменить поисковый запрос' : 'Начните с создания первого склада'}
          </p>
        </div>
      )}
    </div>
  );
}