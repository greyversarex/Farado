import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  ArrowLeft, 
  Warehouse as WarehouseIcon, 
  MapPin, 
  Package, 
  Plus, 
  Edit, 
  Trash2,
  Search,
  User
} from 'lucide-react';
import type { Warehouse, WarehouseInventory, InsertWarehouseInventory } from '@shared/schema';
import { UniversalItemForm } from '@/components/forms/UniversalItemForm';

// Helper function to format numbers without trailing zeros
const formatNumber = (value: string | number): string => {
  if (!value) return '0';
  const num = parseFloat(value.toString());
  return num % 1 === 0 ? num.toString() : num.toFixed(3).replace(/\.?0+$/, '');
};

export default function WarehouseDetails() {
  const [match, params] = useRoute('/admin/warehouse/:id');
  const warehouseId = params?.id ? parseInt(params.id) : null;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [isEditItemDialogOpen, setIsEditItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WarehouseInventory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: warehouse, isLoading: warehouseLoading, error: warehouseError } = useQuery({
    queryKey: ['/api/admin/warehouses', warehouseId],
    queryFn: async () => {
      if (!warehouseId) return null;
      console.log('Fetching warehouse with ID:', warehouseId);
      const response = await apiRequest(`/api/admin/warehouses/${warehouseId}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Warehouse data received:', data);
      return data;
    },
    enabled: !!warehouseId,
    retry: false,
  });

  const { data: inventory = [], isLoading: inventoryLoading } = useQuery({
    queryKey: ['/api/admin/warehouse-inventory', warehouseId],
    queryFn: async () => {
      if (!warehouseId) return [];
      console.log('Fetching inventory for warehouse ID:', warehouseId);
      const response = await apiRequest(`/api/admin/warehouse-inventory/${warehouseId}`);
      if (!response.ok) {
        console.error('Failed to fetch inventory:', response.status, response.statusText);
        return [];
      }
      const data = await response.json();
      console.log('Inventory data received:', data);
      return data;
    },
    enabled: !!warehouseId,
    retry: false,
  });

  const addItemMutation = useMutation({
    mutationFn: async (data: InsertWarehouseInventory) => {
      return await apiRequest('/api/admin/warehouse-inventory', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          warehouseId: warehouseId,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/warehouse-inventory', warehouseId] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/inventory-counts'] });
      setIsAddItemDialogOpen(false);
      toast({
        title: 'Успешно',
        description: 'Товар добавлен на склад',
      });
    },
    onError: (error) => {
      console.error('Error adding item:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить товар',
        variant: 'destructive',
      });
    },
  });

  const editItemMutation = useMutation({
    mutationFn: async (data: { id: number; itemData: any }) => {
      return await apiRequest(`/api/admin/warehouse-inventory/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify(data.itemData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/warehouse-inventory', warehouseId] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/inventory-counts'] });
      setIsEditItemDialogOpen(false);
      setEditingItem(null);
      toast({
        title: 'Успешно',
        description: 'Товар обновлен',
      });
    },
    onError: (error) => {
      console.error('Error updating item:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить товар',
        variant: 'destructive',
      });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (itemId: number) => {
      return await apiRequest(`/api/admin/warehouse-inventory/${itemId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/warehouse-inventory', warehouseId] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/inventory-counts'] });
      toast({
        title: 'Успешно',
        description: 'Товар удален',
      });
    },
    onError: (error) => {
      console.error('Error deleting item:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить товар',
        variant: 'destructive',
      });
    },
  });



  const filteredInventory = inventory.filter((item: WarehouseInventory) =>
    item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!match || !warehouseId) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Склад не найден</h2>
          <p className="text-gray-600 mt-2">Неверный ID склада</p>
          <Button
            className="mt-4"
            onClick={() => window.location.href = '/admin'}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к админке
          </Button>
        </div>
      </div>
    );
  }

  if (warehouseLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Загрузка склада...</p>
          </div>
        </div>
      </div>
    );
  }

  if (warehouseError) {
    console.error('Warehouse error:', warehouseError);
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">Ошибка загрузки</h2>
          <p className="text-gray-600 mt-2">
            {warehouseError instanceof Error ? warehouseError.message : 'Не удалось загрузить склад'}
          </p>
          <Button
            className="mt-4"
            onClick={() => window.location.href = '/admin'}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к админке
          </Button>
        </div>
      </div>
    );
  }

  if (!warehouse) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Склад не найден</h2>
          <p className="text-gray-600 mt-2">Склад с ID {warehouseId} не существует</p>
          <Button
            className="mt-4"
            onClick={() => window.location.href = '/admin'}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к админке
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => window.location.href = '/admin'}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к админке
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <WarehouseIcon className="w-6 h-6 mr-2 text-blue-600" />
              {warehouse.name}
            </h1>
            {warehouse.location && (
              <p className="text-gray-600 mt-1 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {warehouse.location}
              </p>
            )}
          </div>
        </div>
        <Badge className={warehouse.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
          {warehouse.isActive ? 'Активен' : 'Неактивен'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Информация о складе */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <WarehouseIcon className="w-5 h-5 mr-2" />
                Информация о складе
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {warehouse.address && (
                <div className="flex items-start text-sm">
                  <MapPin className="w-4 h-4 mr-3 mt-0.5 text-gray-500" />
                  <span>{warehouse.address}</span>
                </div>
              )}
              {warehouse.manager && (
                <div className="flex items-center text-sm">
                  <User className="w-4 h-4 mr-3 text-gray-500" />
                  <span>Менеджер: {warehouse.manager}</span>
                </div>
              )}
              {warehouse.capacity && (
                <div className="flex items-center text-sm">
                  <Package className="w-4 h-4 mr-3 text-gray-500" />
                  <span>Вместимость: {warehouse.capacity} м³</span>
                </div>
              )}
              <div className="flex items-center text-sm">
                <Package className="w-4 h-4 mr-3 text-green-600" />
                <span className="font-medium">
                  Товаров на складе: {inventory.length}
                </span>
              </div>
              {warehouse.comments && (
                <div className="text-sm text-gray-600 border-t pt-3">
                  <strong>Комментарии:</strong>
                  <p className="mt-1">{warehouse.comments}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Список товаров */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Товары на складе ({inventory.length})
                </CardTitle>
                <Button onClick={() => setIsAddItemDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить товар
                </Button>
              </div>
              
              {/* Поиск */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Поиск товаров..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              {inventoryLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Загрузка товаров...</p>
                </div>
              ) : filteredInventory.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {searchQuery ? 'Товары не найдены' : 'На складе пока нет товаров'}
                  </p>
                  {!searchQuery && (
                    <Button 
                      className="mt-4" 
                      onClick={() => setIsAddItemDialogOpen(true)}
                    >
                      Добавить первый товар
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredInventory.map((item: WarehouseInventory) => (
                    <div key={item.id} className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200">
                      {/* Header with red background */}
                      <div className="bg-red-600 px-4 py-3 border-b-2 border-red-700">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <h3 className="font-bold text-white text-lg">{item.name}</h3>
                              <Badge variant="outline" className="bg-white text-gray-900 border-white">
                                {item.code}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="text-sm text-red-100 font-medium">
                                Количество: {item.quantity} шт
                              </span>
                              {item.pricePerUnit && parseFloat(item.pricePerUnit) > 0 && (
                                <span className="text-sm text-red-100 font-medium">
                                  Цена: ${item.pricePerUnit}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingItem(item);
                                setIsEditItemDialogOpen(true);
                              }}
                              className="h-8 w-8 p-0 hover:bg-red-700 hover:bg-opacity-50"
                            >
                              <Edit className="w-4 h-4 text-white" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (window.confirm(`Вы уверены, что хотите удалить "${item.name}"?`)) {
                                  deleteItemMutation.mutate(item.id);
                                }
                              }}
                              className="h-8 w-8 p-0 hover:bg-red-700 hover:bg-opacity-50"
                            >
                              <Trash2 className="w-4 h-4 text-white" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-4">
                        {item.description && (
                          <p className="text-gray-600 mb-3">{item.description}</p>
                        )}
                        {item.characteristics && (
                          <div className="border-l-4 border-blue-500 bg-blue-50 pl-4 pr-3 py-3 mb-3">
                            <p className="text-sm text-gray-700">
                              <span className="font-semibold text-blue-700">Характеристики:</span> {item.characteristics}
                            </p>
                          </div>
                        )}
                        {item.volume && (
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Объем:</span> {formatNumber(item.volume)} м³
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Универсальная форма для добавления товара */}
      {isAddItemDialogOpen && (
        <UniversalItemForm
          mode="inventory"
          warehouseId={warehouseId}
          warehouseName={warehouse.name}
          onClose={() => setIsAddItemDialogOpen(false)}
          onSubmit={(data) => addItemMutation.mutate(data)}
        />
      )}

      {/* Универсальная форма для редактирования товара */}
      {isEditItemDialogOpen && editingItem && (
        <UniversalItemForm
          mode="inventory"
          warehouseId={warehouseId}
          warehouseName={warehouse.name}
          editData={editingItem}
          onClose={() => {
            setIsEditItemDialogOpen(false);
            setEditingItem(null);
          }}
          onSubmit={(data) => editItemMutation.mutate({ id: editingItem.id, itemData: data })}
        />
      )}
    </div>
  );
}