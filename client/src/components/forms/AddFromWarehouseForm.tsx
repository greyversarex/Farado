import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, Package, Plus, X } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface WarehouseItem {
  id: number;
  warehouseId: number;
  warehouseName: string;
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

interface AddFromWarehouseFormProps {
  onClose: () => void;
  onSubmit: (itemData: any) => void;
  orderId: number;
}

export function AddFromWarehouseForm({ onClose, onSubmit, orderId }: AddFromWarehouseFormProps) {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
  const [inventoryItems, setInventoryItems] = useState<WarehouseItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<WarehouseItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<WarehouseItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  // Загрузка складов
  useEffect(() => {
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

  // Загрузка товаров со склада
  useEffect(() => {
    if (selectedWarehouse) {
      const loadInventory = async () => {
        setLoading(true);
        try {
          const response = await apiRequest(`/api/admin/warehouse-inventory/${selectedWarehouse}`);
          if (response.ok) {
            const data = await response.json();
            // Добавляем название склада к каждому товару
            const itemsWithWarehouse = data.map((item: any) => ({
              ...item,
              warehouseName: warehouses.find(w => w.id === parseInt(selectedWarehouse))?.name || 'Неизвестно'
            }));
            setInventoryItems(itemsWithWarehouse);
            setFilteredItems(itemsWithWarehouse);
          }
        } catch (error) {
          console.error('Failed to load inventory:', error);
        } finally {
          setLoading(false);
        }
      };
      loadInventory();
    }
  }, [selectedWarehouse, warehouses]);

  // Фильтрация товаров
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    const itemData = {
      orderId: orderId,
      code: selectedItem.code,
      name: selectedItem.name,
      quantity: quantity,
      characteristics: selectedItem.characteristics,
      description: selectedItem.description,
      deliveryPeriod: selectedItem.deliveryPeriod,
      transport: selectedItem.transport,
      volumeType: selectedItem.volumeType,
      pricePerUnit: selectedItem.pricePerUnit,
      volume: selectedItem.volume,
      weight: selectedItem.volumeType === 'kg' ? selectedItem.volume : 0,
      warehouseId: selectedItem.warehouseId,
      status: 'На складе',
      paymentStatus: 'unpaid',
      photos: [],
      totalAmount: (selectedItem.pricePerUnit * quantity).toFixed(2),
      remainingAmount: (selectedItem.pricePerUnit * quantity).toFixed(2)
    };

    onSubmit(itemData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="w-5 h-5" />
              Добавить товар со склада
            </CardTitle>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Выбор склада */}
            <div className="space-y-2">
              <Label htmlFor="warehouse">Выберите склад</Label>
              <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите склад" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((warehouse) => (
                    <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                      <span className="break-words">{warehouse.name} - {warehouse.location}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Поиск товаров */}
            {selectedWarehouse && (
              <div className="space-y-2">
                <Label htmlFor="search">Поиск товара</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Поиск по коду, названию или описанию..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            {/* Список товаров */}
            {selectedWarehouse && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <Label>Товары на складе</Label>
                  <Badge variant="outline">
                    {filteredItems.length} товаров
                  </Badge>
                </div>
                
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Загрузка товаров...</p>
                  </div>
                ) : filteredItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Товары не найдены</p>
                  </div>
                ) : (
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {filteredItems.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedItem?.id === item.id 
                            ? 'border-red-500 bg-red-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedItem(item)}
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-1 sm:space-y-0">
                              <h4 className="font-medium break-words">{item.name}</h4>
                              <Badge variant="outline" className="self-start">{item.code}</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1 break-words">{item.description}</p>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 text-sm text-gray-500 space-y-1 sm:space-y-0">
                              <span>Доступно: {item.availableQuantity} шт.</span>
                              <span>Цена: ${item.pricePerUnit}</span>
                              <span>{item.volume} {item.volumeType}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Количество */}
            {selectedItem && (
              <div className="space-y-2">
                <Label htmlFor="quantity">Количество</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max={selectedItem.availableQuantity}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-32"
                  />
                  <span className="text-sm text-gray-500">
                    из {selectedItem.availableQuantity} доступных
                  </span>
                </div>
              </div>
            )}

            {/* Итоговая информация */}
            {selectedItem && (
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h4 className="font-medium mb-2">Итого:</h4>
                <div className="space-y-1 text-sm">
                  <div className="break-words">Товар: {selectedItem.name}</div>
                  <div>Количество: {quantity} шт.</div>
                  <div>Цена за единицу: ${selectedItem.pricePerUnit}</div>
                  <div className="font-medium text-green-600 pt-2 border-t">
                    Общая стоимость: ${(selectedItem.pricePerUnit * quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            )}

            {/* Кнопки */}
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
              <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
                Отмена
              </Button>
              <Button 
                type="submit" 
                disabled={!selectedItem || quantity <= 0 || quantity > selectedItem.availableQuantity}
                className="w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Добавить в заказ
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}