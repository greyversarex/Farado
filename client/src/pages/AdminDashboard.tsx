import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  Warehouse, 
  Search, 
  Plus, 
  Eye, 
  Edit,
  Filter,
  LogOut,
  Camera,
  ShoppingCart,
  Trash2,
  Users,
  UserCog,
  Box,
  Clock,
  Truck,
  Archive
} from 'lucide-react';
import { AddItemForm } from '@/components/forms/AddItemForm';
import { AddFromInventoryForm } from '@/components/forms/AddFromInventoryForm';
import { EditOrderForm } from '@/components/forms/EditOrderForm';
import { EditItemForm } from '@/components/forms/EditItemForm';
import { UniversalItemForm } from '@/components/forms/UniversalItemForm';
import { PhotoUpload } from '@/components/PhotoUpload';
import { ItemChangeHistory } from '@/components/ItemChangeHistory';
import { OrderDocuments } from '@/components/OrderDocuments';
import Counterparties from './admin/Counterparties';
import { WarehouseManagement } from './admin/WarehouseManagement';
import { TrucksManagement } from './admin/TrucksManagement';
import { ArchiveManagement } from './admin/ArchiveManagement';
import UsersManagement from './admin/UsersManagement';

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
}

const warehouses = ['Гуанчжоу', 'Фошань', 'Урумчи', 'Кашгар', 'Иу'];

// Helper function to format numbers without trailing zeros
const formatNumber = (value: string | number): string => {
  if (!value) return '0';
  const num = parseFloat(value.toString());
  return num % 1 === 0 ? num.toString() : num.toFixed(3).replace(/\.?0+$/, '');
};

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderItems, setOrderItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showAddFromInventory, setShowAddFromInventory] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [orderHistory, setOrderHistory] = useState<any[]>([]);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [photoModalItem, setPhotoModalItem] = useState<any>(null);
  const [changeHistoryItem, setChangeHistoryItem] = useState<any>(null);
  const [documentsOrder, setDocumentsOrder] = useState<any>(null);

  const authHeaders = (() => {
    const savedCredentials = localStorage.getItem('adminCredentials');
    if (savedCredentials) {
      const credentials = JSON.parse(savedCredentials);
      return {
        username: credentials.username,
        password: credentials.password
      };
    }
    return {
      username: user.username,
      password: user.password || 'admin123'
    };
  })();

  // Calculate order totals
  const calculateOrderTotals = (items: any[]) => {
    return items.reduce((acc, item) => {
      const totalAmount = parseFloat(item.totalAmount) || 0;
      const remainingAmount = parseFloat(item.remainingAmount) || 0;
      return {
        totalAmount: acc.totalAmount + totalAmount,
        remainingAmount: acc.remainingAmount + remainingAmount
      };
    }, { totalAmount: 0, remainingAmount: 0 });
  };

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab, statusFilter]);

  // Check for order parameter in URL and auto-open order details
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order');
    if (orderId && orders.length > 0) {
      const order = orders.find((o: any) => o.id === parseInt(orderId));
      if (order) {
        fetchOrderDetails(parseInt(orderId));
      }
    }
  }, [orders]);

  const fetchOrders = async () => {
    try {
      const url = statusFilter === 'all' ? '/api/admin/orders' : `/api/admin/orders?status=${statusFilter}`;
      const response = await fetch(url, { 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.error('Failed to fetch orders:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const fetchOrderDetails = async (orderId: number) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, { 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSelectedOrder(data);
        setOrderItems(data.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    }
  };



  const createOrder = async (orderData: any) => {
    try {
      const payload: any = {
        name: orderData.name,
        code: orderData.code,
        comments: orderData.comments,
      };
      
      // Only add counterpartyId if it's not empty or "none"
      if (orderData.counterpartyId && orderData.counterpartyId !== '' && orderData.counterpartyId !== 'none') {
        payload.counterpartyId = parseInt(orderData.counterpartyId);
      }

      const response = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        fetchOrders();
        setShowCreateOrder(false);
      }
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };

  const addItemToOrder = async (itemData: any) => {
    try {
      console.log('Adding order item with data:', { 
        ...itemData, 
        photosCount: itemData.photos?.length || 0 
      });
      
      const response = await fetch(`/api/admin/orders/${selectedOrder.id}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify(itemData),
      });
      
      if (response.ok) {
        console.log('Order item added successfully');
        fetchOrderDetails(selectedOrder.id);
        setShowAddItem(false);
        setShowAddFromInventory(false);
        
        // Update inventory if item was added from inventory
        if (itemData.fromInventory && itemData.inventoryItemId) {
          await updateInventoryQuantity(itemData.inventoryItemId, itemData.quantity);
        }
      } else {
        const errorText = await response.text();
        console.error('Failed to add order item:', response.status, errorText);
        alert('Ошибка при сохранении товара: ' + errorText);
      }
    } catch (error) {
      console.error('Failed to add item to order:', error);
      alert('Ошибка при сохранении товара');
    }
  };

  const updateInventoryQuantity = async (inventoryItemId: number, usedQuantity: number) => {
    try {
      await fetch(`/api/admin/inventory/${inventoryItemId}/reduce`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify({ quantity: usedQuantity }),
      });
    } catch (error) {
      console.error('Failed to update inventory:', error);
    }
  };





  const handleUniversalSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const response = await fetch(`/api/admin/search?q=${encodeURIComponent(searchQuery)}`, {
        headers: authHeaders
      });
      if (response.ok) {
        const results = await response.json();
        setSearchResults(results);
      }
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const updateOrder = async (orderId: number, orderData: any) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify(orderData),
      });
      if (response.ok) {
        fetchOrders();
        setEditingOrder(null);
        alert('Заказ успешно обновлен');
      } else {
        alert('Ошибка при обновлении заказа');
      }
    } catch (error) {
      console.error('Failed to update order:', error);
      alert('Ошибка при обновлении заказа');
    }
  };

  const updateOrderItem = async (itemId: number, itemData: any) => {
    try {
      const response = await fetch(`/api/admin/order-items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify(itemData),
      });
      if (response.ok) {
        fetchOrderDetails(selectedOrder.id);
        setEditingItem(null);
        alert('Товар успешно обновлен');
      } else {
        const errorData = await response.json();
        console.error('Update failed:', errorData);
        alert('Ошибка при обновлении товара');
      }
    } catch (error) {
      console.error('Failed to update order item:', error);
      alert('Ошибка при обновлении товара');
    }
  };

  const deleteOrder = async (orderId: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот заказ? Это действие нельзя отменить.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        }
      });
      if (response.ok) {
        fetchOrders();
        setSelectedOrder(null);
        alert('Заказ успешно удален');
      } else {
        alert('Ошибка при удалении заказа');
      }
    } catch (error) {
      console.error('Failed to delete order:', error);
      alert('Ошибка при удалении заказа');
    }
  };

  const deleteOrderItem = async (itemId: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/orders/${selectedOrder.id}/items/${itemId}`, {
        method: 'DELETE',
        headers: authHeaders
      });
      if (response.ok) {
        fetchOrderDetails(selectedOrder.id);
      }
    } catch (error) {
      console.error('Failed to delete order item:', error);
    }
  };



  const updateItemPhotos = async (itemId: number, photos: string[]) => {
    try {
      const response = await fetch(`/api/admin/orders/items/${itemId}/photos`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify({ photos }),
      });
      if (response.ok) {
        fetchOrderDetails(selectedOrder.id);
        setPhotoModalItem(null);
      }
    } catch (error) {
      console.error('Failed to update item photos:', error);
    }
  };





  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status });
        }
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const updateItemStatus = async (itemId: number, status: string, photos?: string[]) => {
    try {
      const response = await fetch(`/api/admin/order-items/${itemId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify({ status, photos }),
      });
      if (response.ok && selectedOrder) {
        fetchOrderDetails(selectedOrder.id);
      }
    } catch (error) {
      console.error('Failed to update item status:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const response = await fetch(`/api/admin/search?q=${encodeURIComponent(searchQuery)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Failed to search:', error);
    }
  };

  const renderOrders = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold">Заказы</h2>
        <Button onClick={() => setShowCreateOrder(true)} size="sm" className="mobile-button">
          <Plus className="w-4 h-4 mr-2" />
          <span className="text-sm">Добавить заказ</span>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Поиск заказов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10 h-9 sm:h-10 mobile-input"
          />
        </div>
        <div className="flex gap-2 sm:gap-3">
          <Button onClick={handleSearch} size="sm" className="flex-1 sm:flex-none">
            <span className="text-sm">Поиск</span>
          </Button>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32 sm:w-40 h-9 sm:h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="active">Активные</SelectItem>
              <SelectItem value="completed">Завершенные</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-xl shadow-lg border-2 border-gray-100 overflow-hidden">
        {/* Заголовок таблицы */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-5">
          <div className="grid grid-cols-12 gap-4 text-sm font-bold text-white tracking-wide text-center">
            <div className="col-span-2 flex items-center">
              <span>Название груза</span>
            </div>
            <div className="col-span-2 flex items-center">
              <span>Имя заказчика</span>
            </div>
            <div className="col-span-1 flex items-center justify-center">
              <span>Пункт назначения</span>
            </div>
            <div className="col-span-1 flex items-center justify-center">
              <span>Статус товара</span>
            </div>
            <div className="col-span-1 flex items-center justify-center">
              <span>Количество</span>
            </div>
            <div className="col-span-1 flex items-center justify-center">
              <span>Вес (кг)</span>
            </div>
            <div className="col-span-1 flex items-center justify-center">
              <span>Объём м³</span>
            </div>
            <div className="col-span-2 flex items-center justify-center">
              <span>Дата отправки</span>
            </div>
            <div className="col-span-1 flex items-center justify-center">
              <span>Ожидаемая дата доставки</span>
            </div>
          </div>
        </div>
        
        {/* Строки заказов */}
        <div className="divide-y divide-gray-100">
          {orders.map((order: any, index: number) => (
            <div 
              key={order.id} 
              className={`px-8 py-6 hover:bg-gradient-to-r hover:from-red-25 hover:to-red-50 transition-all duration-300 cursor-pointer ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
              }`}
              onClick={() => fetchOrderDetails(order.id)}
            >
              <div className="grid grid-cols-12 gap-4 text-sm items-center">
                {/* Название груза */}
                <div className="col-span-2">
                  <div className="font-bold text-gray-900 text-base leading-tight">
                    {order.name}
                  </div>
                  {order.code && (
                    <div className="text-xs text-gray-500 mt-1.5 font-medium bg-gray-100 px-2 py-0.5 rounded-md inline-block">
                      Код: {order.code}
                    </div>
                  )}
                </div>

                {/* Имя заказчика */}
                <div className="col-span-2">
                  <div className="font-semibold text-gray-900 text-sm leading-tight">
                    {order.counterpartyName || 'Ultra Тестовый'}
                  </div>
                  {order.counterpartyCompany && (
                    <div className="text-xs text-gray-500 mt-1">
                      {order.counterpartyCompany}
                    </div>
                  )}
                </div>

                {/* Пункт назначения */}
                <div className="col-span-1 flex justify-center">
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-300 font-semibold px-3 py-1">
                    Таджикистан
                  </Badge>
                </div>

                {/* Статус товара */}
                <div className="col-span-1 flex justify-center">
                  <Badge 
                    variant={order.status === 'active' ? 'default' : 'secondary'} 
                    className={`text-xs font-semibold px-3 py-1 ${
                      order.status === 'active' 
                        ? 'bg-green-100 text-green-800 border-green-300' 
                        : 'bg-gray-100 text-gray-700 border-gray-300'
                    }`}
                  >
                    {order.status === 'active' ? 'В пути' : order.status === 'completed' ? 'Завершён' : 'Доставлено'}
                  </Badge>
                </div>

                {/* Количество */}
                <div className="col-span-1 flex justify-center">
                  <div className="text-center">
                    <div className="font-bold text-gray-900 text-base">
                      {order.totalQuantity || '3'}
                    </div>
                    <div className="text-xs text-gray-500">шт</div>
                  </div>
                </div>

                {/* Вес */}
                <div className="col-span-1 flex justify-center">
                  <div className="text-center">
                    <div className="font-bold text-gray-900 text-base">
                      {formatNumber(order.totalWeight || '0')}
                    </div>
                    <div className="text-xs text-gray-500">кг</div>
                  </div>
                </div>

                {/* Объём */}
                <div className="col-span-1 flex justify-center">
                  <div className="text-center">
                    <div className="font-bold text-gray-900 text-base">
                      {formatNumber(order.totalVolume || '0')}
                    </div>
                    <div className="text-xs text-gray-500">м³</div>
                  </div>
                </div>

                {/* Дата отправки */}
                <div className="col-span-2 flex justify-center">
                  <div className="text-center">
                    <div className="font-semibold text-gray-800 text-sm">
                      {order.createdAt 
                        ? new Date(order.createdAt).toLocaleDateString('ru-RU', { 
                            day: '2-digit', 
                            month: '2-digit' 
                          }) 
                        : '03.07'
                      }
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.createdAt 
                        ? new Date(order.createdAt).getFullYear()
                        : '2025'
                      }
                    </div>
                  </div>
                </div>

                {/* Ожидаемая дата доставки */}
                <div className="col-span-1 flex justify-center">
                  <div className="text-center">
                    <div className="font-semibold text-gray-800 text-sm">
                      {order.expectedDelivery 
                        ? new Date(order.expectedDelivery).toLocaleDateString('ru-RU', { 
                            day: '2-digit', 
                            month: '2-digit' 
                          }) 
                        : 'Не указана'
                      }
                    </div>
                    {order.expectedDelivery && (
                      <div className="text-xs text-gray-500">
                        {new Date(order.expectedDelivery).getFullYear()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {orders.map((order: any, index: number) => (
          <div
            key={order.id}
            className="bg-white rounded-lg shadow-md border border-gray-200 p-4 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => fetchOrderDetails(order.id)}
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-base leading-tight">
                    {order.name}
                  </h3>
                  {order.code && (
                    <div className="text-xs text-gray-500 mt-1 font-medium bg-gray-100 px-2 py-0.5 rounded-md inline-block">
                      Код: {order.code}
                    </div>
                  )}
                </div>
                <Badge 
                  variant={order.status === 'active' ? 'default' : 'secondary'} 
                  className={`text-xs font-semibold px-2 py-1 ${
                    order.status === 'active' 
                      ? 'bg-green-100 text-green-800 border-green-300' 
                      : 'bg-gray-100 text-gray-700 border-gray-300'
                  }`}
                >
                  {order.status === 'active' ? 'В пути' : order.status === 'completed' ? 'Завершён' : 'Доставлено'}
                </Badge>
              </div>

              {/* Customer */}
              <div>
                <span className="text-xs text-gray-600 font-medium">Заказчик:</span>
                <div className="font-semibold text-gray-900 text-sm">
                  {order.counterpartyName || 'Ultra Тестовый'}
                </div>
                {order.counterpartyCompany && (
                  <div className="text-xs text-gray-500">
                    {order.counterpartyCompany}
                  </div>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="text-xs text-gray-600">Количество</div>
                  <div className="font-bold text-gray-900 text-sm">
                    {order.totalQuantity || '3'} шт
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="text-xs text-gray-600">Вес</div>
                  <div className="font-bold text-gray-900 text-sm">
                    {formatNumber(order.totalWeight || '0')} кг
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="text-xs text-gray-600">Объём</div>
                  <div className="font-bold text-gray-900 text-sm">
                    {formatNumber(order.totalVolume || '0')} м³
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="flex justify-between text-xs text-gray-600">
                <div>
                  <span className="font-medium">Отправка:</span>
                  <div className="text-gray-900">
                    {order.createdAt 
                      ? new Date(order.createdAt).toLocaleDateString('ru-RU') 
                      : '03.07.2025'
                    }
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-medium">Ожид. доставка:</span>
                  <div className="text-gray-900">
                    {order.expectedDelivery 
                      ? new Date(order.expectedDelivery).toLocaleDateString('ru-RU') 
                      : 'Не указана'
                    }
                  </div>
                </div>
              </div>

              {/* Destination */}
              <div className="flex justify-center">
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-300 font-semibold px-3 py-1">
                  Таджикистан
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );



  const renderSearch = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold">Поиск по системе</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Универсальный поиск</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Код заказа, товара или название..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleUniversalSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleUniversalSearch}>Найти</Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Поиск по заказам, товарам, контрагентам и складским позициям
          </p>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults && (
        <Card>
          <CardHeader>
            <CardTitle>Результаты поиска</CardTitle>
          </CardHeader>
          <CardContent>
            {searchResults.orders?.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium mb-3">Заказы ({searchResults.orders.length})</h4>
                <div className="grid gap-2">
                  {searchResults.orders.map((order: any) => (
                    <div key={order.id} className="p-3 border rounded cursor-pointer hover:bg-gray-50"
                         onClick={() => fetchOrderDetails(order.id)}>
                      <p className="font-medium">{order.name}</p>
                      <p className="text-sm text-gray-600">
                        Склад: {order.warehouse} | Статус: {order.status}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchResults.items?.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium mb-3">Товары ({searchResults.items.length})</h4>
                <div className="grid gap-2">
                  {searchResults.items.map((item: any) => (
                    <div key={item.id} className="p-3 border rounded">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Код: {item.code} | Статус: {item.status}
                      </p>
                      <p className="text-sm text-gray-500">
                        Заказ: {item.order?.name || 'Неизвестно'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchResults.counterparties?.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium mb-3">Контрагенты ({searchResults.counterparties.length})</h4>
                <div className="grid gap-2">
                  {searchResults.counterparties.map((counterparty: any) => (
                    <div key={counterparty.id} className="p-3 border rounded cursor-pointer hover:bg-gray-50"
                         onClick={() => window.location.href = `/admin/counterparty/${counterparty.id}`}>
                      <p className="font-medium">{counterparty.name}</p>
                      {counterparty.company && (
                        <p className="text-sm text-gray-600">Компания: {counterparty.company}</p>
                      )}
                      <p className="text-sm text-gray-500">
                        Тип: {counterparty.type === 'client' ? 'Клиент' : counterparty.type === 'supplier' ? 'Поставщик' : 'Клиент/Поставщик'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchResults.inventory?.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium mb-3">Складские позиции ({searchResults.inventory.length})</h4>
                <div className="grid gap-2">
                  {searchResults.inventory.map((item: any) => (
                    <div key={item.id} className="p-3 border rounded cursor-pointer hover:bg-gray-50"
                         onClick={() => window.location.href = `/admin/warehouse/${item.warehouseId}`}>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Код: {item.code} | Количество: {item.quantity}
                      </p>
                      {item.description && (
                        <p className="text-sm text-gray-500">{item.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(!searchResults.orders?.length && !searchResults.items?.length && 
              !searchResults.counterparties?.length && !searchResults.inventory?.length) && (
              <p className="text-gray-500 text-center py-4">
                По запросу "{searchQuery}" ничего не найдено
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-white via-gray-50 to-white border-b border-gray-200 shadow-lg mobile-header">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center min-w-0">
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-2 sm:p-3 rounded-xl shadow-lg mr-3 sm:mr-4">
                <Package className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent truncate">FARADO TEAM</h1>
                <p className="text-xs sm:text-sm text-gray-600 font-medium hidden sm:block">Система управления заказами</p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="text-right hidden md:block">
                <span className="text-xs text-gray-600 font-medium">Добро пожаловать,</span>
                <div className="text-sm font-semibold text-gray-900">{user.fullName}</div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onLogout}
                className="text-gray-700 hover:text-red-600 hover:border-red-300 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
              >
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Выйти</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-lg border border-gray-200 p-3 sm:p-4 mb-6 mobile-nav-tabs">
            <TabsList className="grid w-full grid-cols-7 h-16 sm:h-20 bg-transparent rounded-lg gap-1 sm:gap-2 p-1">
              <TabsTrigger 
                value="orders" 
                className="relative font-semibold px-2 py-2 rounded-lg transition-all duration-300 
                data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 
                data-[state=active]:text-white data-[state=active]:shadow-md
                hover:bg-red-50 hover:text-red-600 text-gray-600
                flex flex-col items-center justify-center h-full mobile-nav-tab"
              >
                <Package className="w-5 h-5 sm:w-6 sm:h-6 mb-0 sm:mb-1 mobile-nav-icon" />
                <span className="hidden sm:block text-xs font-medium">Заказы</span>
              </TabsTrigger>
              <TabsTrigger 
                value="warehouses" 
                className="relative font-semibold px-2 py-2 rounded-lg transition-all duration-300 
                data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 
                data-[state=active]:text-white data-[state=active]:shadow-md
                hover:bg-red-50 hover:text-red-600 text-gray-600
                flex flex-col items-center justify-center h-full mobile-nav-tab"
              >
                <Warehouse className="w-5 h-5 sm:w-6 sm:h-6 mb-0 sm:mb-1 mobile-nav-icon" />
                <span className="hidden sm:block text-xs font-medium">Склады</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="trucks" 
                className="relative font-semibold px-2 py-2 rounded-lg transition-all duration-300 
                data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 
                data-[state=active]:text-white data-[state=active]:shadow-md
                hover:bg-red-50 hover:text-red-600 text-gray-600
                flex flex-col items-center justify-center h-full mobile-nav-tab"
              >
                <Truck className="w-5 h-5 sm:w-6 sm:h-6 mb-0 sm:mb-1 mobile-nav-icon" />
                <span className="hidden sm:block text-xs font-medium">Фуры</span>
              </TabsTrigger>

              <TabsTrigger 
                value="archive" 
                className="relative font-semibold px-2 py-2 rounded-lg transition-all duration-300 
                data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 
                data-[state=active]:text-white data-[state=active]:shadow-md
                hover:bg-red-50 hover:text-red-600 text-gray-600
                flex flex-col items-center justify-center h-full mobile-nav-tab"
              >
                <Archive className="w-5 h-5 sm:w-6 sm:h-6 mb-0 sm:mb-1 mobile-nav-icon" />
                <span className="hidden sm:block text-xs font-medium">Архив</span>
              </TabsTrigger>

              <TabsTrigger 
                value="counterparties" 
                className="relative font-semibold px-2 py-2 rounded-lg transition-all duration-300 
                data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 
                data-[state=active]:text-white data-[state=active]:shadow-md
                hover:bg-red-50 hover:text-red-600 text-gray-600
                flex flex-col items-center justify-center h-full mobile-nav-tab"
              >
                <Users className="w-5 h-5 sm:w-6 sm:h-6 mb-0 sm:mb-1 mobile-nav-icon" />
                <span className="hidden sm:block text-xs font-medium">Контрагенты</span>
              </TabsTrigger>
              <TabsTrigger 
                value="search" 
                className="relative font-semibold px-2 py-2 rounded-lg transition-all duration-300 
                data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 
                data-[state=active]:text-white data-[state=active]:shadow-md
                hover:bg-red-50 hover:text-red-600 text-gray-600
                flex flex-col items-center justify-center h-full mobile-nav-tab"
              >
                <Search className="w-5 h-5 sm:w-6 sm:h-6 mb-0 sm:mb-1 mobile-nav-icon" />
                <span className="hidden sm:block text-xs font-medium">Поиск</span>
              </TabsTrigger>
              <TabsTrigger 
                value="users" 
                className="relative font-semibold px-2 py-2 rounded-lg transition-all duration-300 
                data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 
                data-[state=active]:text-white data-[state=active]:shadow-md
                hover:bg-red-50 hover:text-red-600 text-gray-600
                flex flex-col items-center justify-center h-full mobile-nav-tab"
                data-testid="tab-users"
              >
                <UserCog className="w-5 h-5 sm:w-6 sm:h-6 mb-0 sm:mb-1 mobile-nav-icon" />
                <span className="hidden sm:block text-xs font-medium">Пользователи</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="orders">
            {renderOrders()}
          </TabsContent>
          
          <TabsContent value="warehouses">
            <WarehouseManagement />
          </TabsContent>

          <TabsContent value="trucks">
            <TrucksManagement />
          </TabsContent>

          <TabsContent value="archive">
            <ArchiveManagement />
          </TabsContent>
          
          <TabsContent value="counterparties">
            <Counterparties />
          </TabsContent>
          
          <TabsContent value="search">
            {renderSearch()}
          </TabsContent>

          <TabsContent value="users">
            <UsersManagement />
          </TabsContent>
        </Tabs>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
            <Card className="w-full max-w-4xl max-h-screen overflow-y-auto">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-2">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg sm:text-xl truncate">{selectedOrder.name}</CardTitle>
                    <p className="text-xs sm:text-sm text-gray-600 break-words">
                      Склад: {selectedOrder.warehouse}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Создан: {new Date(selectedOrder.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button 
                      size="sm"
                      variant="default"
                      onClick={() => setEditingOrder(selectedOrder)}
                      className="text-xs"
                    >
                      <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      Редактировать заказ
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => setDocumentsOrder(selectedOrder)}
                      className="text-xs"
                    >
                      <Archive className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      Документы
                    </Button>
                    <Button 
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteOrder(selectedOrder.id)}
                      className="text-xs"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      Удалить заказ
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setSelectedOrder(null)} className="text-xs">
                      Закрыть
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-3 sm:px-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <span className="font-medium text-sm sm:text-base">Статус:</span>
                    <Select value={selectedOrder.status} onValueChange={(status) => updateOrderStatus(selectedOrder.id, status)}>
                      <SelectTrigger className="w-full sm:w-40 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Активный</SelectItem>
                        <SelectItem value="completed">Завершен</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {selectedOrder.comments && (
                    <div className="space-y-1">
                      <span className="font-medium text-sm sm:text-base">Комментарии:</span>
                      <p className="text-gray-600 text-sm sm:text-base break-words">{selectedOrder.comments}</p>
                    </div>
                  )}

                  {/* Order Totals */}
                  {orderItems.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 border-b">
                        <h4 className="font-semibold text-gray-900 text-sm">Итоговые суммы по заказу</h4>
                      </div>
                      <div className="p-4">
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Итоговая сумма:</span>
                              <span className="font-bold text-gray-900">
                                ${calculateOrderTotals(orderItems).totalAmount.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Остаток:</span>
                              <span className="font-bold text-red-600">
                                ${calculateOrderTotals(orderItems).remainingAmount.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 gap-3 sm:gap-2">
                      <h3 className="font-semibold text-sm sm:text-base">Товары:</h3>
                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Button 
                          size="sm" 
                          onClick={() => setShowAddItem(true)}
                          className="text-xs"
                        >
                          <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          Добавить товар
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setShowAddFromInventory(true)}
                          className="text-xs"
                        >
                          <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          Со склада
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {orderItems.map((item: any) => (
                        <div key={item.id} className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200">
                          {/* Header */}
                          <div className="bg-red-600 px-4 py-3 border-b-2 border-red-700">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="font-bold text-white text-lg">{item.name}</h4>
                                <div className="flex items-center gap-3 mt-2">
                                  <Badge variant="outline" className="text-xs bg-white text-gray-900 border-white">
                                    {item.code}
                                  </Badge>
                                  <span className="text-sm text-red-100 font-medium">Кол-во: {item.quantity} шт</span>
                                  {item.paymentStatus && (
                                    <Badge variant="outline" className="text-xs bg-white text-gray-900 border-white">
                                      {item.paymentStatus === 'paid' ? 'Оплачено' : 
                                       item.paymentStatus === 'prepaid' ? 'Предоплата' : 'Постоплата'}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-4">
                            {/* Characteristics */}
                            {item.characteristics && (
                              <div className="border-l-4 border-blue-500 bg-blue-50 pl-4 pr-3 py-3 mb-4">
                                <p className="text-sm text-gray-700">
                                  <span className="font-semibold text-blue-700">Характеристики:</span> {item.characteristics}
                                </p>
                              </div>
                            )}

                            {/* Financial Information */}
                            <div className="border border-gray-300 rounded-lg mb-4">
                              <div className="bg-gray-50 px-3 py-2 border-b border-gray-300">
                                <h5 className="text-sm font-bold text-gray-800">💰 Финансовая информация</h5>
                              </div>
                              <div className="p-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                                  <div className="flex justify-between py-1">
                                    <span className="text-gray-600">Цена за единицу:</span>
                                    <span className="font-semibold text-gray-900">{item.pricePerUnit ? `$${parseFloat(item.pricePerUnit).toFixed(2)}` : 'Не указана'}</span>
                                  </div>
                                  <div className="flex justify-between py-1">
                                    <span className="text-gray-600">Цена за товары:</span>
                                    <span className="font-semibold text-gray-900">
                                      {(item.totalPrice && parseFloat(item.totalPrice) > 0) ? `$${parseFloat(item.totalPrice).toFixed(2)}` : 
                                       (item.pricePerUnit && parseFloat(item.pricePerUnit) > 0) ? `$${(parseFloat(item.pricePerUnit) * item.quantity).toFixed(2)}` : 
                                       'Не указана'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between py-1">
                                    <span className="text-gray-600">Стоимость транспорта:</span>
                                    <span className="font-semibold text-gray-900">{item.totalTransportCost ? `$${item.totalTransportCost}` : 'Не указана'}</span>
                                  </div>
                                  <div className="flex justify-between py-1">
                                    <span className="text-gray-600">Транспорт:</span>
                                    <span className="font-semibold text-gray-900">{item.transport || 'Авто'}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Totals */}
                            {((item.totalAmount && parseFloat(item.totalAmount) > 0) || (item.remainingAmount && parseFloat(item.remainingAmount) > 0)) && (
                              <div className="border border-gray-300 rounded-lg mb-4">
                                <div className="bg-gray-50 px-3 py-2 border-b border-gray-300">
                                  <h5 className="text-sm font-bold text-gray-800">📊 Итоговые суммы</h5>
                                </div>
                                <div className="p-3">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                    {item.totalAmount && parseFloat(item.totalAmount) > 0 && (
                                      <div className="flex justify-between py-1">
                                        <span className="text-gray-600">Итоговая сумма:</span>
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

                            {/* Delivery Information */}
                            <div className="border border-gray-300 rounded-lg mb-4">
                              <div className="bg-gray-50 px-3 py-2 border-b border-gray-300">
                                <h5 className="text-sm font-bold text-gray-800">🚚 Доставка</h5>
                              </div>
                              <div className="p-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                                  <div className="flex justify-between py-1">
                                    <span className="text-gray-600">Пункт назначения:</span>
                                    <span className="font-semibold text-gray-900">{item.destination || 'Не указан'}</span>
                                  </div>
                                  <div className="flex justify-between py-1">
                                    <span className="text-gray-600">Объем/Вес:</span>
                                    <span className="font-semibold text-gray-900">{formatNumber(item.volumeType === 'kg' ? item.weight : item.volume)} {item.volumeType}</span>
                                  </div>
                                  {item.truck && (
                                    <div className="flex justify-between py-1">
                                      <span className="text-gray-600">Фура:</span>
                                      <span className="font-semibold text-blue-600">{item.truck.number}</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between py-1">
                                    <span className="text-gray-600">Дата отправки:</span>
                                    <span className="font-semibold text-gray-900">
                                      {item.shipmentDate ? new Date(item.shipmentDate).toLocaleDateString('ru-RU') : 'Не указана'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between py-1">
                                    <span className="text-gray-600">Ожид. доставка:</span>
                                    <span className="font-semibold text-gray-900">
                                      {item.expectedDeliveryDate ? new Date(item.expectedDeliveryDate).toLocaleDateString('ru-RU') : 'Не указана'}
                                    </span>
                                  </div>
                                  {item.deliveryPeriod && (
                                    <div className="flex justify-between py-1 sm:col-span-2">
                                      <span className="text-gray-600">Срок доставки:</span>
                                      <span className="font-semibold text-gray-900">{item.deliveryPeriod}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Управление товаром */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-gray-200">
                              <div className="flex flex-col sm:flex-row gap-2">
                                <Button size="sm" variant="outline" onClick={() => setEditingItem(item)} className="text-xs">
                                  <Edit className="w-3 h-3 mr-1" />
                                  Изменить
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => setChangeHistoryItem(item)} className="text-xs">
                                  <Clock className="w-3 h-3 mr-1" />
                                  История
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => deleteOrderItem(item.id)} className="text-xs">
                                  <Trash2 className="w-3 h-3 mr-1" />
                                  Удалить
                                </Button>
                                {item.fromInventory && (
                                  <Badge variant="secondary" className="text-xs self-start">
                                    Со склада
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                                <Select 
                                  value={item.status} 
                                  onValueChange={(status) => updateItemStatus(item.id, status)}
                                >
                                  <SelectTrigger className="w-full sm:w-36 h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="На складе">На складе</SelectItem>
                                    <SelectItem value="Отправлено">Отправлено</SelectItem>
                                    <SelectItem value="Доставлено">Доставлено</SelectItem>
                                  </SelectContent>
                                </Select>
                                
                                {(item.status === 'Отправлено' || item.status === 'Доставлено') && (
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="text-xs"
                                    onClick={() => setPhotoModalItem(item)}
                                  >
                                    <Camera className="w-3 h-3 mr-1" />
                                    Фото {item.photos?.length ? `(${item.photos.length})` : ''}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Create Order Modal */}
        {showCreateOrder && (
          <CreateOrderModal 
            onClose={() => setShowCreateOrder(false)}
            onCreate={createOrder}
          />
        )}

        {/* Add Item Modal */}
        {showAddItem && selectedOrder && (
          <AddItemForm
            orderId={selectedOrder.id}
            onClose={() => setShowAddItem(false)}
            onSubmit={addItemToOrder}
          />
        )}

        {/* Add From Inventory Modal */}
        {showAddFromInventory && selectedOrder && (
          <AddFromInventoryForm
            onClose={() => setShowAddFromInventory(false)}
            onSubmit={addItemToOrder}
            orderId={selectedOrder.id}
            orderWarehouse={selectedOrder.warehouse}
            authHeaders={authHeaders}
          />
        )}



        {/* Edit Order Modal */}
        {editingOrder && (
          <EditOrderForm
            order={editingOrder}
            onClose={() => setEditingOrder(null)}
            onUpdate={updateOrder}
          />
        )}

        {/* Edit Item Modal */}
        {editingItem && (
          <EditItemForm
            key={`edit-${editingItem.id}-${Date.now()}`}
            item={editingItem}
            onClose={() => setEditingItem(null)}
            onUpdate={(itemId, data) => {
              updateOrderItem(itemId, data);
            }}
          />
        )}



        {/* Photo Upload Modal */}
        {photoModalItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
            <Card className="w-full max-w-2xl max-h-screen overflow-y-auto">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                  <CardTitle className="text-lg sm:text-xl">
                    Фотографии: {photoModalItem.name}
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setPhotoModalItem(null)}>
                    Закрыть
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-3 sm:px-6">
                <PhotoUpload
                  existingPhotos={photoModalItem.photos || []}
                  onPhotosChange={(photos) => updateItemPhotos(photoModalItem.id, photos)}
                  maxPhotos={10}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Order Documents Modal */}
        {documentsOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
            <Card className="w-full max-w-4xl max-h-screen overflow-y-auto">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg sm:text-xl">Документы заказа</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setDocumentsOrder(null)}>
                    Закрыть
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-3 sm:px-6">
                <OrderDocuments 
                  orderId={documentsOrder.id} 
                  orderName={documentsOrder.name} 
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Item Change History Modal */}
        {changeHistoryItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
            <Card className="w-full max-w-3xl max-h-screen overflow-y-auto">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                  <CardTitle className="text-lg sm:text-xl">
                    История изменений: {changeHistoryItem.name}
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setChangeHistoryItem(null)}>
                    Закрыть
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-3 sm:px-6">
                <ItemChangeHistory itemId={changeHistoryItem.id} authHeaders={authHeaders} />
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

interface CreateOrderModalProps {
  onClose: () => void;
  onCreate: (orderData: any) => void;
}

function CreateOrderModal({ onClose, onCreate }: CreateOrderModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    comments: '',
    counterpartyId: '',
    status: 'active',
    destination: '',
    expectedDelivery: ''
  });
  const [counterparties, setCounterparties] = useState([]);

  // Load counterparties when modal opens
  useEffect(() => {
    const loadCounterparties = async () => {
      try {
        const credentials = localStorage.getItem('adminCredentials');
        const authHeaders = credentials ? JSON.parse(credentials) : {};
        
        const response = await fetch('/api/admin/counterparties', {
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders
          }
        });
        if (response.ok) {
          const data = await response.json();
          setCounterparties(data);
        }
      } catch (error) {
        console.error('Failed to load counterparties:', error);
      }
    };
    loadCounterparties();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      counterpartyId: formData.counterpartyId && formData.counterpartyId !== 'none' 
        ? parseInt(formData.counterpartyId) 
        : null,
      expectedDelivery: formData.expectedDelivery || null
    };
    onCreate(submitData);
    setFormData({ name: '', code: '', comments: '', counterpartyId: '', status: 'active', destination: '', expectedDelivery: '' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-screen overflow-y-auto">
        <CardHeader>
          <CardTitle>Создать новый заказ</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Название заказа</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Например: Юсуф-77"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Код заказа</label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Например: FARA-2400-DO"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Контрагент</label>
              <Select
                value={formData.counterpartyId}
                onValueChange={(value) => setFormData({ ...formData, counterpartyId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите контрагента (опционально)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Без контрагента</SelectItem>
                  {counterparties.map((cp: any) => (
                    <SelectItem key={cp.id} value={String(cp.id)}>
                      {cp.name} {cp.company ? `(${cp.company})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Статус заказа</label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Активный</SelectItem>
                  <SelectItem value="completed">Завершен</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Пункт назначения</label>
              <Input
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                placeholder="Например: Душанбе"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Ожидаемая дата доставки</label>
              <Input
                type="date"
                value={formData.expectedDelivery}
                onChange={(e) => setFormData({ ...formData, expectedDelivery: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Комментарии</label>
              <Textarea
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                placeholder="Дополнительные комментарии"
                rows={3}
              />
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700">Создать заказ</Button>
              <Button type="button" variant="outline" onClick={onClose}>Отмена</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

