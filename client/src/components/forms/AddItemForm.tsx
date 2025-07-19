import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { PhotoUpload } from '@/components/PhotoUpload';

interface AddItemFormProps {
  onClose: () => void;
  onSubmit: (itemData: any) => void;
  orderId: number;
}

export function AddItemForm({ onClose, onSubmit, orderId }: AddItemFormProps) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    quantity: 1,
    characteristics: '',
    deliveryPeriod: '',
    destination: '',
    shipmentDate: '',
    expectedDeliveryDate: '',
    transport: 'Авто',
    comments: '',
    volumeType: 'kg',
    transportPrice: '0',
    pricePerUnit: '0',
    totalPrice: '0',
    totalTransportCost: '0',
    volume: '0',
    weight: '0',
    status: 'На складе',
    paymentStatus: 'unpaid',
    photos: [] as string[],
    warehouseId: '',
    totalAmount: '0',
    remainingAmount: '0'
  });

  const [autoCalculate, setAutoCalculate] = useState(true);

  // Загружаем список складов
  const { data: warehouses = [] } = useQuery<any[]>({
    queryKey: ['/api/admin/warehouses'],
  });

  // Автоматические расчеты
  useEffect(() => {
    if (autoCalculate) {
      const quantity = parseFloat(formData.quantity.toString()) || 0;
      const pricePerUnit = parseFloat(formData.pricePerUnit) || 0;
      const transportPrice = parseFloat(formData.transportPrice) || 0;
      
      const totalPrice = (quantity * pricePerUnit).toFixed(2);
      const totalTransportCost = formData.volumeType === 'kg' 
        ? (parseFloat(formData.weight) * transportPrice).toFixed(2)
        : (parseFloat(formData.volume) * transportPrice).toFixed(2);
      
      setFormData(prev => ({
        ...prev,
        totalPrice,
        totalTransportCost
      }));
    }
  }, [
    formData.quantity, 
    formData.pricePerUnit, 
    formData.transportPrice, 
    formData.volume, 
    formData.weight,
    formData.volumeType,
    autoCalculate
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submissionData = {
      code: formData.code,
      name: formData.name,
      quantity: formData.quantity,
      characteristics: formData.characteristics,
      deliveryPeriod: formData.deliveryPeriod,
      destination: formData.destination,
      shipmentDate: formData.shipmentDate || null,
      expectedDeliveryDate: formData.expectedDeliveryDate || null,
      transport: formData.transport || 'Авто',
      comments: formData.comments || '',
      volumeType: formData.volumeType || 'kg',
      transportPrice: parseFloat(formData.transportPrice) || 0,
      pricePerUnit: parseFloat(formData.pricePerUnit) || 0,
      totalPrice: parseFloat(formData.totalPrice) || 0,
      totalTransportCost: parseFloat(formData.totalTransportCost) || 0,
      volume: parseFloat(formData.volume) || 0,
      weight: parseFloat(formData.weight) || 0,
      status: formData.status || 'На складе',
      paymentStatus: formData.paymentStatus || 'unpaid',
      photos: Array.isArray(formData.photos) ? formData.photos : [],
      orderId,
      warehouseId: (formData.warehouseId && formData.warehouseId !== 'none') ? parseInt(formData.warehouseId) : null,
      totalAmount: formData.totalAmount || '0',
      remainingAmount: formData.remainingAmount || '0'
    };
    
    onSubmit(submissionData);
  };

  const transportOptions = ['Авто', 'ЖД', 'Авиа', 'Море'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <CardTitle className="text-lg bg-red-600 text-white p-2 rounded">🔥 НОВАЯ ФОРМА - ОБНОВЛЕНО 🔥</CardTitle>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Основная информация */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">Основная информация</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code" className="text-sm sm:text-base">Код товара</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="Например: Fara-22-do"
                    required
                    className="h-9 sm:h-10"
                  />
                </div>
                <div>
                  <Label htmlFor="name" className="text-sm sm:text-base">Название товара</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Например: Кириешки"
                    required
                    className="h-9 sm:h-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="characteristics" className="text-sm sm:text-base">Характеристики</Label>
                <Textarea
                  id="characteristics"
                  value={formData.characteristics}
                  onChange={(e) => setFormData({ ...formData, characteristics: e.target.value })}
                  placeholder="Описание характеристик товара"
                  rows={2}
                  className="text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Количество и измерения */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">Количество и измерения</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="quantity" className="text-sm sm:text-base">Количество</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                    min="1"
                    required
                    className="h-9 sm:h-10"
                  />
                </div>
                <div>
                  <Label htmlFor="volumeType" className="text-sm sm:text-base">Тип измерения</Label>
                  <Select
                    value={formData.volumeType}
                    onValueChange={(value) => setFormData({ ...formData, volumeType: value })}
                  >
                    <SelectTrigger className="h-9 sm:h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">кг</SelectItem>
                      <SelectItem value="m³">м³</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="transportPrice" className="text-sm sm:text-base">Цена перевозки за {formData.volumeType}</Label>
                  <Input
                    id="transportPrice"
                    type="number"
                    step="0.01"
                    value={formData.transportPrice}
                    onChange={(e) => setFormData({ ...formData, transportPrice: e.target.value })}
                    placeholder="0.00"
                    className="h-9 sm:h-10"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.volumeType === 'kg' && (
                  <div>
                    <Label htmlFor="weight">Вес (кг)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.001"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      placeholder="0.000"
                    />
                  </div>
                )}
                {formData.volumeType === 'm³' && (
                  <div>
                    <Label htmlFor="volume">Объем (м³)</Label>
                    <Input
                      id="volume"
                      type="number"
                      step="0.001"
                      value={formData.volume}
                      onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                      placeholder="0.000"
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="pricePerUnit">Цена за единицу (USD)</Label>
                  <Input
                    id="pricePerUnit"
                    type="number"
                    step="0.01"
                    value={formData.pricePerUnit}
                    onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Расчет стоимости */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Расчет стоимости</h3>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-calculate"
                    checked={autoCalculate}
                    onCheckedChange={setAutoCalculate}
                  />
                  <Label htmlFor="auto-calculate">Автоматический расчет</Label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="totalPrice">Цена за товары (USD)</Label>
                  <Input
                    id="totalPrice"
                    type="number"
                    step="0.01"
                    value={formData.totalPrice || ''}
                    onChange={(e) => setFormData({ ...formData, totalPrice: e.target.value })}
                    placeholder="0.00"
                    disabled={autoCalculate}
                  />
                  {autoCalculate && (
                    <p className="text-xs text-green-600 mt-1">
                      Рассчитано: {formData.quantity} × {formData.pricePerUnit} = {formData.totalPrice} USD
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="totalTransportCost">Стоимость транспорта (USD)</Label>
                  <Input
                    id="totalTransportCost"
                    type="number"
                    step="0.01"
                    value={formData.totalTransportCost || ''}
                    onChange={(e) => setFormData({ ...formData, totalTransportCost: e.target.value })}
                    placeholder="0.00"
                    disabled={autoCalculate}
                  />
                  {autoCalculate && (
                    <p className="text-xs text-green-600 mt-1">
                      Рассчитано: {formData.volumeType === 'kg' ? formData.weight : formData.volume} × {formData.transportPrice} = {formData.totalTransportCost} USD
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Транспорт */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Транспорт</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="transport">Тип транспорта</Label>
                  <Select
                    value={formData.transport}
                    onValueChange={(value) => setFormData({ ...formData, transport: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {transportOptions.map((transport) => (
                        <SelectItem key={transport} value={transport}>
                          {transport}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Логистика */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Логистика</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="warehouse">Склад</Label>
                  <Select
                    value={formData.warehouseId}
                    onValueChange={(value) => setFormData({ ...formData, warehouseId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите склад" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Без склада</SelectItem>
                      {warehouses.map((warehouse: any) => (
                        <SelectItem key={warehouse.id} value={String(warehouse.id)}>
                          {warehouse.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="destination">Пункт назначения</Label>
                  <Input
                    id="destination"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    placeholder="Душанбе, Таджикистан"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="shipmentDate">Дата отправки</Label>
                  <Input
                    id="shipmentDate"
                    type="date"
                    value={formData.shipmentDate}
                    onChange={(e) => setFormData({ ...formData, shipmentDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="expectedDeliveryDate">Ожидаемая дата доставки</Label>
                  <Input
                    id="expectedDeliveryDate"
                    type="date"
                    value={formData.expectedDeliveryDate}
                    onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="deliveryPeriod">Срок доставки (дни)</Label>
                  <Input
                    id="deliveryPeriod"
                    value={formData.deliveryPeriod}
                    onChange={(e) => setFormData({ ...formData, deliveryPeriod: e.target.value })}
                    placeholder="Например: 7"
                  />
                </div>
              </div>
            </div>

            {/* Статус и оплата */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Статус и оплата</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Статус товара</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
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
                <div>
                  <Label htmlFor="paymentStatus">Статус оплаты</Label>
                  <Select
                    value={formData.paymentStatus}
                    onValueChange={(value) => setFormData({ ...formData, paymentStatus: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Оплачено</SelectItem>
                      <SelectItem value="partial">Частично</SelectItem>
                      <SelectItem value="unpaid">Не оплачено</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="totalAmount">Общая сумма (USD)</Label>
                  <Input
                    id="totalAmount"
                    type="number"
                    step="0.01"
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="remainingAmount">Остаток (USD)</Label>
                  <Input
                    id="remainingAmount"
                    type="number"
                    step="0.01"
                    value={formData.remainingAmount}
                    onChange={(e) => setFormData({ ...formData, remainingAmount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Фотографии */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Фотографии</h3>
              <PhotoUpload
                photos={formData.photos}
                onPhotosChange={(photos) => setFormData({ ...formData, photos })}
              />
            </div>

            {/* Комментарии */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Комментарии</h3>
              <div>
                <Label htmlFor="comments">Дополнительные комментарии</Label>
                <Textarea
                  id="comments"
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  placeholder="Дополнительные комментарии..."
                  rows={3}
                />
              </div>
            </div>

            {/* Кнопки */}
            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Отмена
              </Button>
              <Button type="submit" disabled={!formData.code || !formData.name}>
                Добавить товар
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}