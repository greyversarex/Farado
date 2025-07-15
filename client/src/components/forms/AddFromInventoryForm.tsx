import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Package, X } from 'lucide-react';
import { PhotoUpload } from '@/components/PhotoUpload';

interface InventoryItem {
  id: number;
  warehouseId: number;
  warehouseName?: string;
  code: string;
  name: string;
  description: string;
  characteristics: string;
  availableQuantity: number;
  volumeType: string;
  pricePerUnit: number;
  volume: number;
  deliveryPeriod: string;
  transport: string;
}

interface AddFromInventoryFormProps {
  onClose: () => void;
  onSubmit: (itemData: any) => void;
  orderId: number;
  orderWarehouse: string;
  authHeaders: any;
}

export function AddFromInventoryForm({ onClose, onSubmit, orderId, orderWarehouse, authHeaders }: AddFromInventoryFormProps) {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = inventoryItems.filter(item =>
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(inventoryItems);
    }
  }, [searchQuery, inventoryItems]);

  const fetchInventory = async () => {
    try {
      // Если склад заказа не указан, получаем все склады и их инвентарь
      if (!orderWarehouse || orderWarehouse === 'null' || orderWarehouse === null) {
        // Получаем все склады
        const warehousesResponse = await fetch('/api/admin/warehouses', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders
          }
        });
        
        if (warehousesResponse.ok) {
          const warehouses = await warehousesResponse.json();
          let allInventory: InventoryItem[] = [];
          
          // Получаем инвентарь со всех складов
          for (const warehouse of warehouses) {
            try {
              const inventoryResponse = await fetch(`/api/admin/warehouse-inventory/${warehouse.id}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  ...authHeaders
                }
              });
              
              if (inventoryResponse.ok) {
                const inventory = await inventoryResponse.json();
                allInventory = [...allInventory, ...inventory];
              }
            } catch (error) {
              console.error(`Failed to fetch inventory for warehouse ${warehouse.id}:`, error);
            }
          }
          
          setInventoryItems(allInventory);
          setFilteredItems(allInventory);
        }
      } else {
        // Получаем инвентарь конкретного склада
        const response = await fetch(`/api/admin/inventory/${orderWarehouse}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders
          }
        });
        if (response.ok) {
          const data = await response.json();
          setInventoryItems(data);
          setFilteredItems(data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    const totalPrice = (selectedItem.pricePerUnit * (selectedItem.volume || 1) * quantity).toFixed(2);

    onSubmit({
      orderId,
      warehouseId: selectedItem.warehouseId,
      code: selectedItem.code,
      name: selectedItem.name,
      quantity,
      characteristics: selectedItem.characteristics || '',
      deliveryPeriod: selectedItem.deliveryPeriod || '',
      transport: selectedItem.transport || 'Авто',
      destination: '',
      shipmentDate: '',
      expectedDeliveryDate: '',
      comments: '',
      volumeType: selectedItem.volumeType || 'kg',
      pricePerUnit: selectedItem.pricePerUnit || 0,
      volume: selectedItem.volume || 0,
      weight: 0,
      totalPrice: parseFloat(totalPrice),
      transportPrice: '0',
      totalTransportCost: '0',
      status: 'На складе',
      paymentStatus: 'unpaid',
      photos: [],
      fromInventory: true,
      inventoryItemId: selectedItem.id
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2">Загрузка товаров со склада...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-screen overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              Добавить товар со склада
              {orderWarehouse && orderWarehouse !== 'null' && orderWarehouse !== null ? `: ${orderWarehouse}` : ' (все склады)'}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Поиск по коду, названию или описанию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Inventory Items */}
          <div className="grid gap-3 max-h-96 overflow-y-auto">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedItem?.id === item.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{item.name}</span>
                        <span className="text-sm text-gray-500">({item.code})</span>
                        {item.warehouseName && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {item.warehouseName}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      )}
                      {item.characteristics && (
                        <p className="text-xs text-gray-500 mt-1">
                          Характеристики: {item.characteristics}
                        </p>
                      )}
                      <div className="flex gap-4 mt-2 text-xs text-gray-600">
                        <span>Доступно: {item.availableQuantity} шт</span>
                        <span>Цена: {item.pricePerUnit} USD/{item.volumeType}</span>
                        <span>Объем: {item.volume} {item.volumeType}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                {searchQuery ? 'Товары не найдены' : 'На складе нет товаров'}
              </div>
            )}
          </div>

          {/* Selected Item Details */}
          {selectedItem && (
            <form onSubmit={handleSubmit} className="border-t pt-6">
              <h3 className="font-medium mb-4">Выбранный товар: {selectedItem.name}</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="quantity">Количество*</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max={selectedItem.availableQuantity}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Максимум: {selectedItem.availableQuantity} шт
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <Label className="text-sm font-medium text-green-800">Расчет общей стоимости</Label>
                  <div className="mt-2 space-y-1">
                    <div className="text-2xl font-bold text-green-600">
                      {(selectedItem.pricePerUnit * selectedItem.volume * quantity).toFixed(2)} USD
                    </div>
                    <div className="text-sm text-green-700">
                      {selectedItem.pricePerUnit} USD/{selectedItem.volumeType} × {selectedItem.volume} {selectedItem.volumeType} × {quantity} шт
                    </div>
                    <div className="text-xs text-green-600">
                      Автоматическое обновление при изменении количества
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Добавить в заказ
                </Button>
                <Button type="button" variant="outline" onClick={onClose}>
                  Отмена
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}