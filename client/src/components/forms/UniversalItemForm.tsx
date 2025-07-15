import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Upload, Wand2, X, Calculator, CreditCard, Warehouse } from 'lucide-react';
import { PhotoUpload } from '@/components/PhotoUpload';

interface UniversalItemFormProps {
  onClose: () => void;
  onSubmit: (itemData: any) => void;
  orderId?: number;
  warehouseId?: number;
  warehouseName?: string;
  mode: 'order' | 'inventory';
  editData?: any;
  title?: string;
}

export function UniversalItemForm({ 
  onClose, 
  onSubmit, 
  orderId, 
  warehouseId, 
  warehouseName,
  mode,
  editData,
  title
}: UniversalItemFormProps) {
  const [formData, setFormData] = useState({
    code: editData?.code || '',
    name: editData?.name || '',
    quantity: editData?.quantity || 1,
    characteristics: editData?.characteristics || '',
    description: editData?.description || '',
    deliveryPeriod: editData?.deliveryPeriod || '',
    destination: editData?.destination || '',
    shipmentDate: editData?.shipmentDate || '',
    expectedDeliveryDate: editData?.expectedDeliveryDate || '',
    transport: editData?.transport || 'Авто',
    comments: editData?.comments || '',
    volumeType: editData?.volumeType || 'kg',
    transportPrice: editData?.transportPrice?.toString() || '0',
    pricePerUnit: editData?.pricePerUnit?.toString() || '0',
    volume: editData?.volume?.toString() || '0',
    weight: editData?.weight?.toString() || '0',
    status: editData?.status || (mode === 'inventory' ? 'На складе' : 'На складе'),
    paymentStatus: editData?.paymentStatus || 'unpaid',
    rawText: editData?.rawText || '',
    photos: editData?.photos || [],
    warehouseId: editData?.warehouseId?.toString() || warehouseId?.toString() || ''
  });

  const [autoFillEnabled, setAutoFillEnabled] = useState(false);

  // Загружаем список складов только для режима заказа
  const { data: warehouses = [] } = useQuery<any[]>({
    queryKey: ['/api/admin/warehouses'],
    enabled: mode === 'order'
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoUpload = (photos: string[]) => {
    setFormData(prev => ({
      ...prev,
      photos
    }));
  };

  const autoFillFromRawText = () => {
    if (!formData.rawText) return;
    
    const lines = formData.rawText.split('\n');
    const newFormData = { ...formData };
    
    lines.forEach((line: string) => {
      const trimmed = line.trim();
      if (trimmed.includes('名称') || trimmed.includes('наименование')) {
        const match = trimmed.match(/[:：]\s*(.+)/);
        if (match) newFormData.name = match[1];
      }
      if (trimmed.includes('数量') || trimmed.includes('количество')) {
        const match = trimmed.match(/[:：]\s*(\d+)/);
        if (match) newFormData.quantity = parseInt(match[1]);
      }
      if (trimmed.includes('重量') || trimmed.includes('вес')) {
        const match = trimmed.match(/[:：]\s*([\d.]+)/);
        if (match) newFormData.weight = match[1];
      }
      if (trimmed.includes('体积') || trimmed.includes('объем')) {
        const match = trimmed.match(/[:：]\s*([\d.]+)/);
        if (match) newFormData.volume = match[1];
      }
      if (trimmed.includes('价格') || trimmed.includes('цена')) {
        const match = trimmed.match(/[:：]\s*([\d.]+)/);
        if (match) newFormData.pricePerUnit = match[1];
      }
    });
    
    setFormData(newFormData);
  };

  const calculateTotalCost = () => {
    const quantity = parseInt(formData.quantity.toString()) || 0;
    const pricePerUnit = parseFloat(formData.pricePerUnit) || 0;
    const volume = parseFloat(formData.volume) || 0;
    const transportPrice = parseFloat(formData.transportPrice) || 0;
    
    let totalCost = 0;
    if (formData.volumeType === 'kg') {
      totalCost = quantity * pricePerUnit + transportPrice;
    } else {
      totalCost = quantity * volume * pricePerUnit + transportPrice;
    }
    
    return totalCost.toFixed(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData: any = {
      code: formData.code,
      name: formData.name,
      characteristics: formData.characteristics,
      quantity: parseInt(formData.quantity.toString()),
      volumeType: formData.volumeType,
      pricePerUnit: parseFloat(formData.pricePerUnit) || 0,
      volume: formData.volumeType === 'm³' ? (parseFloat(formData.volume) || 0) : 0,
      weight: formData.volumeType === 'kg' ? (parseFloat(formData.weight) || 0) : 0,
      photos: formData.photos || [],
      comments: formData.comments,
      totalPrice: parseFloat(calculateTotalCost()),
      warehouseId: formData.warehouseId && formData.warehouseId !== 'none' ? parseInt(formData.warehouseId) : undefined
    };

    // Для режима инвентаря добавляем дополнительные поля
    if (mode === 'inventory') {
      (submitData as any).availableQuantity = parseInt(formData.quantity.toString());
      (submitData as any).description = formData.description;
      if (warehouseId) {
        (submitData as any).warehouseId = warehouseId;
      }
    }

    // Для режима заказа добавляем обязательные поля
    if (mode === 'order' && orderId) {
      submitData.orderId = orderId;
      submitData.status = formData.status;
      submitData.paymentStatus = formData.paymentStatus;
      submitData.transportPrice = '0';
      submitData.totalTransportCost = '0';
      // Заполняем обязательные поля значениями по умолчанию
      submitData.deliveryPeriod = formData.deliveryPeriod || '';
      submitData.transport = formData.transport || 'Авто';
      submitData.destination = formData.destination || '';
      submitData.shipmentDate = formData.shipmentDate || null;
      submitData.expectedDeliveryDate = formData.expectedDeliveryDate || null;
    }

    onSubmit(submitData);
  };

  const formTitle = title || (mode === 'inventory' 
    ? `${editData ? 'Редактировать' : 'Добавить'} товар на склад${warehouseName ? `: ${warehouseName}` : ''}`
    : `${editData ? 'Редактировать' : 'Добавить'} товар в заказ`
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-screen overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold">{formTitle}</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">


            {/* Основная информация */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Код товара *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => handleInputChange('code', e.target.value)}
                  placeholder="Например: ABC-123"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Наименование *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Название товара"
                  required
                />
              </div>
            </div>

            {/* Характеристики */}
            <div className="space-y-2">
              <Label htmlFor="characteristics">Характеристики</Label>
              <Textarea
                id="characteristics"
                value={formData.characteristics}
                onChange={(e) => handleInputChange('characteristics', e.target.value)}
                placeholder="Описание характеристик товара"
                rows={3}
              />
            </div>

            {/* Количество и единицы */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Количество *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                  required
                />
              </div>
              


              <div className="space-y-2">
                <Label htmlFor="volumeType">Тип измерения</Label>
                <Select value={formData.volumeType} onValueChange={(value) => handleInputChange('volumeType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">кг</SelectItem>
                    <SelectItem value="m³">м³</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Размеры и цена */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.volumeType === 'm³' ? (
                <div className="space-y-2">
                  <Label htmlFor="volume">Объем (м³)</Label>
                  <Input
                    id="volume"
                    type="number"
                    step="0.01"
                    value={formData.volume}
                    onChange={(e) => handleInputChange('volume', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="weight">Вес (кг)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.01"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="pricePerUnit">Цена за единицу (USD)</Label>
                <Input
                  id="pricePerUnit"
                  type="number"
                  step="0.01"
                  value={formData.pricePerUnit}
                  onChange={(e) => handleInputChange('pricePerUnit', e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>



            {/* Склад (только для режима заказа) */}
            {mode === 'order' && (
              <div className="space-y-2">
                <Label htmlFor="warehouseId">Склад</Label>
                <Select value={formData.warehouseId} onValueChange={(value) => handleInputChange('warehouseId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите склад" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Не выбран</SelectItem>
                    {warehouses.map((warehouse) => (
                      <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                        {warehouse.name} - {warehouse.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Статус (только для режима заказа) */}
            {mode === 'order' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Статус</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="На складе">На складе</SelectItem>
                      <SelectItem value="Отправлено">Отправлено</SelectItem>
                      <SelectItem value="Доставлено">Доставлено</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentStatus">Статус оплаты</Label>
                  <Select value={formData.paymentStatus} onValueChange={(value) => handleInputChange('paymentStatus', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Оплачено</SelectItem>
                      <SelectItem value="unpaid">Не оплачено</SelectItem>
                      <SelectItem value="partial">Частично оплачено</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Дополнительные поля для режима заказа */}
            {mode === 'order' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="destination">Пункт назначения</Label>
                    <Input
                      id="destination"
                      value={formData.destination}
                      onChange={(e) => handleInputChange('destination', e.target.value)}
                      placeholder="Город назначения"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transportPrice">Стоимость транспорта (USD)</Label>
                    <Input
                      id="transportPrice"
                      type="number"
                      step="0.01"
                      value={formData.transportPrice}
                      onChange={(e) => handleInputChange('transportPrice', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shipmentDate">Дата отправки</Label>
                    <Input
                      id="shipmentDate"
                      type="date"
                      value={formData.shipmentDate}
                      onChange={(e) => handleInputChange('shipmentDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expectedDeliveryDate">Ожидаемая дата доставки</Label>
                    <Input
                      id="expectedDeliveryDate"
                      type="date"
                      value={formData.expectedDeliveryDate}
                      onChange={(e) => handleInputChange('expectedDeliveryDate', e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Комментарии */}
            <div className="space-y-2">
              <Label htmlFor="comments">Комментарии</Label>
              <Textarea
                id="comments"
                value={formData.comments}
                onChange={(e) => handleInputChange('comments', e.target.value)}
                placeholder="Дополнительные комментарии"
                rows={3}
              />
            </div>

            {/* Фотографии */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Upload className="w-4 h-4 text-blue-500" />
                <Label className="text-sm font-medium">Фотографии товара</Label>
              </div>
              <PhotoUpload
                existingPhotos={formData.photos}
                onPhotosChange={handlePhotoUpload}
                maxPhotos={10}
              />
            </div>

            {/* Расчет стоимости (только для режима заказа) */}
            {mode === 'order' && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Calculator className="w-4 h-4 text-green-500" />
                  <span className="font-medium">Расчет стоимости</span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Количество: {formData.quantity} шт.</div>
                  <div>Цена за единицу: {formData.pricePerUnit} USD</div>
                  <div>Объем: {formData.volume} {formData.volumeType}</div>
                  <div>Транспорт: {formData.transportPrice} USD</div>
                  <div className="font-medium text-green-600 pt-2 border-t">
                    Общая стоимость: {calculateTotalCost()} USD
                  </div>
                </div>
              </div>
            )}

            {/* Кнопки */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Отмена
              </Button>
              <Button type="submit">
                {editData ? 'Сохранить изменения' : 'Добавить товар'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}