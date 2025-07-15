import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Warehouse, MapPin, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function WarehouseManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<any>(null);

  const { data: warehouses = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/admin/warehouses'],
  });

  const { data: inventoryCounts = {} } = useQuery<{[key: string]: number}>({
    queryKey: ['/api/admin/inventory-counts'],
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/admin/warehouses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/warehouses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/inventory-counts'] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Успех",
        description: "Склад создан успешно",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось создать склад",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest(`/api/admin/warehouses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/warehouses'] });
      setIsEditDialogOpen(false);
      toast({
        title: "Успех",
        description: "Склад обновлен успешно",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось обновить склад",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/admin/warehouses/${id}`, {
      method: 'DELETE',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/warehouses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/inventory-counts'] });
      toast({
        title: "Успех",
        description: "Склад удален успешно",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось удалить склад",
        variant: "destructive",
      });
    },
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const location = formData.get('location') as string;
    const data = {
      name: location, // Используем город как название
      location: location,
      capacity: (formData.get('capacity') as string) || '0',
      currentUtilization: 0,
      isActive: true,
    };
    createMutation.mutate(data);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWarehouse) return;
    
    const formData = new FormData(e.target as HTMLFormElement);
    const location = formData.get('location') as string;
    const data = {
      name: location, // Используем город как название
      location: location,
      capacity: (formData.get('capacity') as string) || '0',
    };
    updateMutation.mutate({ id: selectedWarehouse.id, data });
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
      <div className="text-center space-y-3">
        <h1 className="font-bold text-[26px]">Управление складами</h1>
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
                <Label htmlFor="location">Город *</Label>
                <Input id="location" name="location" required />
              </div>
              <div>
                <Label htmlFor="capacity">Вместимость (м³)</Label>
                <Input id="capacity" name="capacity" type="number" step="0.1" />
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {warehouses.map((warehouse: any) => (
          <Card 
            key={warehouse.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => {
              console.log('Clicked warehouse:', warehouse.id);
              window.location.href = `/admin/warehouse/${warehouse.id}`;
            }}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Warehouse className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold">{warehouse.name}</span>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedWarehouse(warehouse);
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
                      if (window.confirm(`Вы уверены, что хотите удалить склад "${warehouse.name}"?`)) {
                        deleteMutation.mutate(warehouse.id);
                      }
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{warehouse.location}</span>
              </div>
              
              {warehouse.address && (
                <div className="text-sm text-gray-600">
                  {warehouse.address}
                </div>
              )}
              
              <div className="flex items-center space-x-2 text-sm">
                <Package className="w-4 h-4 text-green-600" />
                <span className="font-medium">
                  Товаров: {inventoryCounts[warehouse.id] || 0}
                </span>
              </div>
              
              {warehouse.capacity && (
                <div className="text-sm text-gray-600">
                  Вместимость: {warehouse.capacity} м³
                </div>
              )}
              
              {warehouse.manager && (
                <div className="text-sm text-gray-600">
                  Менеджер: {warehouse.manager}
                </div>
              )}
              
              {warehouse.phone && (
                <div className="text-sm text-gray-600">
                  Телефон: {warehouse.phone}
                </div>
              )}
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
                <Label htmlFor="edit-location">Город *</Label>
                <Input id="edit-location" name="location" defaultValue={selectedWarehouse.location} required />
              </div>
              <div>
                <Label htmlFor="edit-capacity">Вместимость (м³)</Label>
                <Input id="edit-capacity" name="capacity" type="number" step="0.1" defaultValue={selectedWarehouse.capacity || ''} />
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
      {warehouses.length === 0 && (
        <div className="text-center py-12">
          <Warehouse className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Складов не найдено</h3>
          <p className="text-gray-500">Начните с создания первого склада</p>
        </div>
      )}
    </div>
  );
}