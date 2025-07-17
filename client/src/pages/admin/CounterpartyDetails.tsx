import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  ArrowLeft, Plus, ShoppingCart, User, Building, Mail, Phone, MapPin, 
  CreditCard, DollarSign, Calendar, Package, TrendingUp, Edit, Trash2 
} from 'lucide-react';
import { AddItemFormNew as AddItemForm } from '@/components/forms/AddItemFormNew';
import { EditItemForm } from '@/components/forms/EditItemForm';
import { AddFromWarehouseForm } from '@/components/forms/AddFromWarehouseForm';
import type { Counterparty, Order, InsertOrder } from '@shared/schema';

// Helper function to format numbers without trailing zeros
const formatNumber = (value: string | number): string => {
  if (!value) return '0';
  const num = parseFloat(value.toString());
  return num % 1 === 0 ? num.toString() : num.toFixed(3).replace(/\.?0+$/, '');
};

export default function CounterpartyDetails() {
  const [match, params] = useRoute('/admin/counterparty/:id');
  const counterpartyId = params?.id ? parseInt(params.id) : null;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOrderDialogOpen, setIsCreateOrderDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isAddFromWarehouseModalOpen, setIsAddFromWarehouseModalOpen] = useState(false);
  const [warehouses, setWarehouses] = useState<any[]>([]);

  // Calculate counterparty totals from all orders
  const calculateCounterpartyTotals = () => {
    if (!orders || orders.length === 0) return { totalAmount: 0, remainingAmount: 0 };
    
    return orders.reduce((acc, order) => {
      if (order.items && order.items.length > 0) {
        const orderTotals = order.items.reduce((orderAcc, item) => {
          const totalAmount = parseFloat(item.totalAmount) || 0;
          const remainingAmount = parseFloat(item.remainingAmount) || 0;
          return {
            totalAmount: orderAcc.totalAmount + totalAmount,
            remainingAmount: orderAcc.remainingAmount + remainingAmount
          };
        }, { totalAmount: 0, remainingAmount: 0 });
        
        return {
          totalAmount: acc.totalAmount + orderTotals.totalAmount,
          remainingAmount: acc.remainingAmount + orderTotals.remainingAmount
        };
      }
      return acc;
    }, { totalAmount: 0, remainingAmount: 0 });
  };

  const { data: counterparty, isLoading: counterpartyLoading, error: counterpartyError } = useQuery({
    queryKey: ['/api/admin/counterparties', counterpartyId],
    queryFn: async () => {
      if (!counterpartyId) return null;
      console.log('Fetching counterparty with ID:', counterpartyId);
      const response = await apiRequest(`/api/admin/counterparties/${counterpartyId}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Counterparty data received:', data);
      return data;
    },
    enabled: !!counterpartyId,
    retry: false,
  });

  const { data: orders = [], isLoading: ordersLoading, error: ordersError } = useQuery({
    queryKey: ['/api/admin/counterparty-orders', counterpartyId],
    queryFn: async () => {
      if (!counterpartyId) return [];
      console.log('Fetching orders for counterparty ID:', counterpartyId);
      const response = await apiRequest(`/api/admin/counterparty/${counterpartyId}/orders`);
      if (!response.ok) {
        console.error('Failed to fetch orders:', response.status, response.statusText);
        return [];
      }
      const data = await response.json();
      console.log('Orders data received:', data);
      return data;
    },
    enabled: !!counterpartyId,
    retry: false,
  });

  const fetchOrderDetails = async (orderId: number) => {
    try {
      const response = await apiRequest(`/api/admin/orders/${orderId}`);
      if (response.ok) {
        const orderData = await response.json();
        setSelectedOrder(orderData);
        setOrderItems(orderData.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    }
  };

  // Load warehouses
  React.useEffect(() => {
    const loadWarehouses = async () => {
      try {
        const response = await apiRequest('/api/admin/warehouses');
        if (response.ok) {
          const data = await response.json();
          setWarehouses(data);
        }
      } catch (error) {
        console.error('Failed to load warehouses:', error);
      }
    };
    loadWarehouses();
  }, []);

  // Item management functions
  const addOrderItem = async (itemData: any) => {
    try {
      const response = await apiRequest('/api/admin/order-items', {
        method: 'POST',
        body: JSON.stringify(itemData),
      });
      if (response.ok) {
        await fetchOrderDetails(selectedOrder!.id);
        setIsAddItemModalOpen(false);
        toast({
          title: 'Успешно',
          description: 'Товар добавлен',
        });
      }
    } catch (error) {
      console.error('Failed to add item:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить товар',
        variant: 'destructive',
      });
    }
  };

  const updateOrderItem = async (itemId: number, itemData: any) => {
    try {
      console.log('=== COUNTERPARTY UPDATE ITEM ===');
      console.log('Item ID:', itemId);
      console.log('Item data totalAmount:', itemData.totalAmount);
      console.log('Item data remainingAmount:', itemData.remainingAmount);
      console.log('Full itemData:', itemData);
      
      const response = await apiRequest(`/api/admin/order-items/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify(itemData),
      });
      if (response.ok) {
        await fetchOrderDetails(selectedOrder!.id);
        setEditingItem(null);
        toast({
          title: 'Успешно',
          description: 'Товар обновлен',
        });
      }
    } catch (error) {
      console.error('Failed to update item:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить товар',
        variant: 'destructive',
      });
    }
  };

  const deleteOrderItem = async (itemId: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) return;
    
    try {
      const response = await apiRequest(`/api/admin/order-items/${itemId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchOrderDetails(selectedOrder!.id);
        toast({
          title: 'Успешно',
          description: 'Товар удален',
        });
      }
    } catch (error) {
      console.error('Failed to delete item:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить товар',
        variant: 'destructive',
      });
    }
  };

  const createOrderMutation = useMutation({
    mutationFn: async (data: InsertOrder) => {
      return await apiRequest('/api/admin/orders', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          counterpartyId: counterpartyId,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/counterparty-orders', counterpartyId] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/orders'] });
      setIsCreateOrderDialogOpen(false);
      toast({
        title: 'Успешно',
        description: 'Заказ создан',
      });
    },
    onError: (error) => {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать заказ',
        variant: 'destructive',
      });
    },
  });

  const handleCreateOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const orderData: InsertOrder = {
      name: formData.get('name') as string,
      comments: formData.get('comments') as string || undefined,
      status: 'active',
    };

    createOrderMutation.mutate(orderData);
  };

  const getTypeColor = (type: string | null) => {
    switch (type) {
      case 'client': return 'bg-blue-100 text-blue-800';
      case 'supplier': return 'bg-green-100 text-green-800';
      case 'both': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string | null) => {
    switch (type) {
      case 'client': return 'Клиент';
      case 'supplier': return 'Поставщик';
      case 'both': return 'Клиент/Поставщик';
      default: return 'Не указано';
    }
  };

  if (!match || !counterpartyId) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Контрагент не найден</h2>
          <p className="text-gray-600 mt-2">Неверный ID контрагента</p>
          <Button
            className="mt-4"
            onClick={() => window.location.href = '/admin'}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к контрагентам
          </Button>
        </div>
      </div>
    );
  }

  if (counterpartyLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Загрузка контрагента...</p>
          </div>
        </div>
      </div>
    );
  }

  if (counterpartyError) {
    console.error('Counterparty error:', counterpartyError);
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">Ошибка загрузки</h2>
          <p className="text-gray-600 mt-2">
            {counterpartyError instanceof Error ? counterpartyError.message : 'Не удалось загрузить контрагента'}
          </p>
          <Button
            className="mt-4"
            onClick={() => window.location.href = '/admin'}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к контрагентам
          </Button>
        </div>
      </div>
    );
  }

  if (!counterparty) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Контрагент не найден</h2>
          <p className="text-gray-600 mt-2">Контрагент с ID {counterpartyId} не существует</p>
          <Button
            className="mt-4"
            onClick={() => window.location.href = '/admin'}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к контрагентам
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <Button
            variant="outline"
            onClick={() => window.location.href = '/admin'}
            className="self-start"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">{counterparty.name}</h1>
            {counterparty.company && (
              <p className="text-sm sm:text-base text-gray-600 mt-1">{counterparty.company}</p>
            )}
          </div>
        </div>
        <Badge className={getTypeColor(counterparty.type)}>
          {getTypeLabel(counterparty.type)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Информация о контрагенте */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <User className="w-5 h-5 mr-2" />
                Информация
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 pt-0">
              {counterparty.email && (
                <div className="flex items-center text-sm">
                  <Mail className="w-4 h-4 mr-3 text-gray-500 flex-shrink-0" />
                  <span className="break-all">{counterparty.email}</span>
                </div>
              )}
              {counterparty.phone && (
                <div className="flex items-center text-sm">
                  <Phone className="w-4 h-4 mr-3 text-gray-500 flex-shrink-0" />
                  <span>{counterparty.phone}</span>
                </div>
              )}
              {counterparty.address && (
                <div className="flex items-start text-sm">
                  <MapPin className="w-4 h-4 mr-3 text-gray-500 flex-shrink-0 mt-0.5" />
                  <span className="break-words">{counterparty.address}</span>
                </div>
              )}
              {counterparty.creditLimit && parseFloat(counterparty.creditLimit) > 0 && (
                <div className="flex items-center text-sm">
                  <CreditCard className="w-4 h-4 mr-3 text-gray-500 flex-shrink-0" />
                  <span>Лимит: ${counterparty.creditLimit}</span>
                </div>
              )}
              {counterparty.currentDebt && parseFloat(counterparty.currentDebt) !== 0 && (
                <div className="flex items-center text-sm">
                  <DollarSign className="w-4 h-4 mr-3 text-gray-500 flex-shrink-0" />
                  <span className={parseFloat(counterparty.currentDebt) > 0 ? 'text-red-600' : 'text-green-600'}>
                    Долг: ${counterparty.currentDebt}
                  </span>
                </div>
              )}
              {counterparty.description && (
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-600 break-words">{counterparty.description}</p>
                </div>
              )}
              
              {/* Counterparty Totals */}
              <div className="pt-3 border-t">
                <h4 className="font-medium text-sm mb-3 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Итоговые суммы
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-purple-700">Общая сумма:</span>
                    <span className="font-bold text-purple-800 text-right">
                      ${calculateCounterpartyTotals().totalAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-orange-700">Остаток:</span>
                    <span className="font-bold text-orange-800 text-right">
                      ${calculateCounterpartyTotals().remainingAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Заказы контрагента */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                <CardTitle className="flex items-center text-lg">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Заказы ({orders.length})
                </CardTitle>
                <Dialog open={isCreateOrderDialogOpen} onOpenChange={setIsCreateOrderDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-red-600 hover:bg-red-700 w-full sm:w-auto">
                      <Plus className="w-4 h-4 mr-2" />
                      <span className="sm:hidden">Создать</span>
                      <span className="hidden sm:inline">Создать заказ</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md mx-4 sm:mx-0">
                    <DialogHeader>
                      <DialogTitle className="text-base sm:text-lg">Новый заказ для {counterparty.name}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateOrder} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Название заказа *</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          placeholder="Например: Юсуф-77" 
                          required 
                        />
                      </div>
                      <div>
                        <Label htmlFor="comments">Комментарии</Label>
                        <Textarea 
                          id="comments" 
                          name="comments" 
                          placeholder="Дополнительная информация о заказе"
                          rows={3}
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsCreateOrderDialogOpen(false)} className="w-full sm:w-auto">
                          Отмена
                        </Button>
                        <Button type="submit" disabled={createOrderMutation.isPending} className="w-full sm:w-auto">
                          {createOrderMutation.isPending ? 'Создание...' : 'Создать'}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {ordersLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-600">Загрузка заказов...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>У контрагента пока нет заказов</p>
                  <p className="text-sm">Создайте первый заказ</p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {orders.map((order: Order) => (
                    <Card key={order.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-3 sm:space-y-0">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-1 sm:space-y-0">
                              <h4 className="font-medium text-sm sm:text-base break-words">{order.name}</h4>
                              <Badge variant={order.status === 'active' ? 'default' : 'secondary'} className="self-start">
                                {order.status === 'active' ? 'Активный' : 'Завершен'}
                              </Badge>
                            </div>
                            <div className="flex items-center text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              {order.createdAt ? new Date(order.createdAt.toString()).toLocaleDateString('ru-RU') : 'Дата не указана'}
                            </div>
                            {order.comments && (
                              <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2 break-words">{order.comments}</p>
                            )}
                          </div>
                          <div className="text-right sm:text-left flex-shrink-0">
                            <div className="text-xs sm:text-sm text-gray-600 mb-2">
                              Товаров: {order.items?.length || 0}
                            </div>
                            {order.items && order.items.length > 0 && (
                              <div className="space-y-1 mb-2">
                                <div className="text-xs text-purple-600">
                                  Общая: ${order.items.reduce((sum, item) => sum + (parseFloat(item.totalAmount) || 0), 0).toFixed(2)}
                                </div>
                                <div className="text-xs text-orange-600">
                                  Остаток: ${order.items.reduce((sum, item) => sum + (parseFloat(item.remainingAmount) || 0), 0).toFixed(2)}
                                </div>
                              </div>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => fetchOrderDetails(order.id)}
                              className="w-full sm:w-auto"
                            >
                              Открыть
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                <CardTitle className="text-lg sm:text-xl">Детали заказа: {selectedOrder.name}</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setSelectedOrder(null)}>
                  Закрыть
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Код заказа</p>
                    <p className="font-medium break-all">{selectedOrder.code}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Статус</p>
                    <Badge variant={selectedOrder.status === 'active' ? 'default' : 'secondary'}>
                      {selectedOrder.status === 'active' ? 'Активный' : 'Завершен'}
                    </Badge>
                  </div>
                </div>
                
                {selectedOrder.comments && (
                  <div>
                    <p className="text-sm text-gray-600">Комментарии</p>
                    <p className="font-medium break-words">{selectedOrder.comments}</p>
                  </div>
                )}

                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
                    <h4 className="font-medium">Товары в заказе</h4>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsAddItemModalOpen(true)}
                        className="flex items-center gap-2 w-full sm:w-auto"
                      >
                        <Plus className="w-4 h-4" />
                        Добавить товар
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setIsAddFromWarehouseModalOpen(true)}
                        className="flex items-center gap-2 w-full sm:w-auto"
                      >
                        <Package className="w-4 h-4" />
                        Со склада
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {orderItems.map((item: any) => (
                      <div key={item.id} className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200">
                        {/* Header with name and actions */}
                        <div className="flex justify-between items-start p-4 border-b-2 border-red-700 bg-red-600">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 gap-1">
                              <h3 className="font-bold text-white text-base sm:text-lg break-words">{item.name}</h3>
                              <Badge variant="outline" className="text-xs shrink-0 self-start bg-white text-gray-900 border-white">
                                {item.code}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-sm text-red-100 font-medium">Кол-во: {item.quantity}</span>
                              <Badge 
                                variant={item.status === 'На складе' ? 'secondary' : item.status === 'Отправлено' ? 'default' : 'outline'}
                                className="text-xs bg-white text-gray-900 border-white"
                              >
                                {item.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-1 ml-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingItem(item)}
                              className="h-8 w-8 p-0 hover:bg-red-700 hover:bg-opacity-50"
                            >
                              <Edit className="w-4 h-4 text-white" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteOrderItem(item.id)}
                              className="h-8 w-8 p-0 hover:bg-red-700 hover:bg-opacity-50"
                            >
                              <Trash2 className="w-4 h-4 text-white" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Item details */}
                        <div className="p-4">
                          {/* Financial information */}
                          <div className="border border-gray-300 rounded-lg mb-4">
                            <div className="bg-gray-50 px-3 py-2 border-b border-gray-300">
                              <h4 className="text-sm font-bold text-gray-800">💰 Финансовая информация</h4>
                            </div>
                            <div className="p-3">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                                <div className="flex justify-between py-1">
                                  <span className="text-gray-600">Цена за единицу:</span>
                                  <span className="font-semibold text-gray-900">${item.pricePerUnit || '0.00'}</span>
                                </div>
                                <div className="flex justify-between py-1">
                                  <span className="text-gray-600">Цена за товары:</span>
                                  <span className="font-semibold text-gray-900">${item.pricePerUnit ? (parseFloat(item.pricePerUnit) * item.quantity).toFixed(2) : '0.00'}</span>
                                </div>
                                <div className="flex justify-between py-1">
                                  <span className="text-gray-600">Стоимость транспорта:</span>
                                  <span className="font-semibold text-gray-900">${item.totalTransportCost || '0.00'}</span>
                                </div>
                                <div className="flex justify-between py-1">
                                  <span className="text-gray-600">Транспорт:</span>
                                  <span className="font-semibold text-gray-900">{item.transport || 'Авто'}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Summary totals */}
                          {(item.totalAmount || item.remainingAmount) && (
                            <div className="border border-gray-300 rounded-lg mb-4">
                              <div className="bg-gray-50 px-3 py-2 border-b border-gray-300">
                                <h4 className="text-sm font-bold text-gray-800">📊 Итоговые суммы</h4>
                              </div>
                              <div className="p-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                  {item.totalAmount && parseFloat(item.totalAmount) > 0 && (
                                    <div className="flex justify-between py-1">
                                      <span className="text-gray-600">Общая сумма:</span>
                                      <span className="font-bold text-gray-900">${parseFloat(item.totalAmount).toFixed(2)}</span>
                                    </div>
                                  )}
                                  {item.remainingAmount && parseFloat(item.remainingAmount) > 0 && (
                                    <div className="flex justify-between py-1">
                                      <span className="text-gray-600">Остаток:</span>
                                      <span className="font-bold text-red-600">${parseFloat(item.remainingAmount).toFixed(2)}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Delivery information */}
                          <div className="border border-gray-300 rounded-lg mb-4">
                            <div className="bg-gray-50 px-3 py-2 border-b border-gray-300">
                              <h4 className="text-sm font-bold text-gray-800">🚚 Доставка</h4>
                            </div>
                            <div className="p-3">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                                <div className="flex justify-between py-1">
                                  <span className="text-gray-600">Пункт назначения:</span>
                                  <span className="font-semibold text-gray-900">{item.destination || 'Душанбе, Таджикистан'}</span>
                                </div>
                                <div className="flex justify-between py-1">
                                  <span className="text-gray-600">Объем/Вес:</span>
                                  <span className="font-semibold text-gray-900">{formatNumber(item.volume || '0')} {item.volumeType || 'кг'}</span>
                                </div>
                                {item.expectedDeliveryDate && (
                                  <div className="flex justify-between py-1 sm:col-span-2">
                                    <span className="text-gray-600">Ожид. доставка:</span>
                                    <span className="font-semibold text-gray-900">{new Date(item.expectedDeliveryDate).toLocaleDateString('ru-RU')}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {orderItems.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>В заказе пока нет товаров</p>
                        <p className="text-sm">Добавьте первый товар</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Order Totals */}
                  {orderItems.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-lg mt-4 overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 border-b">
                        <h4 className="font-semibold text-gray-900 text-sm">Итоговые суммы по заказу</h4>
                      </div>
                      <div className="p-4">
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Цена за товары:</span>
                              <span className="font-bold text-gray-900">
                                ${orderItems.reduce((sum, item) => sum + (parseFloat(item.pricePerUnit || 0) * item.quantity), 0).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Стоимость транспорта:</span>
                              <span className="font-bold text-gray-900">
                                ${orderItems.reduce((sum, item) => sum + (parseFloat(item.totalTransportCost) || 0), 0).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Общая сумма:</span>
                              <span className="font-bold text-gray-900">
                                ${orderItems.reduce((sum, item) => sum + (parseFloat(item.totalAmount) || 0), 0).toFixed(2)}
                              </span>
                            </div>
                          </div>
                          
                          {orderItems.some(item => parseFloat(item.remainingAmount) > 0) && (
                            <div className="pt-3 border-t">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Остаток к доплате:</span>
                                <span className="font-bold text-red-600">
                                  ${orderItems.reduce((sum, item) => sum + (parseFloat(item.remainingAmount) || 0), 0).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Item Modal */}
      {isAddItemModalOpen && selectedOrder && (
        <AddItemForm
          orderId={selectedOrder.id}
          warehouses={warehouses}
          onSubmit={addOrderItem}
          onClose={() => setIsAddItemModalOpen(false)}
        />
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <EditItemForm
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onUpdate={(itemId, data) => {
            updateOrderItem(itemId, data);
          }}
        />
      )}

      {/* Add From Warehouse Modal */}
      {isAddFromWarehouseModalOpen && selectedOrder && (
        <AddFromWarehouseForm
          orderId={selectedOrder.id}
          onSubmit={addOrderItem}
          onClose={() => setIsAddFromWarehouseModalOpen(false)}
        />
      )}
    </div>
  );
}