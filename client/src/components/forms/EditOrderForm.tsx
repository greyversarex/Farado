import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';

interface EditOrderFormProps {
  order: any;
  onClose: () => void;
  onUpdate: (orderId: number, data: any) => void;
}

export function EditOrderForm({ order, onClose, onUpdate }: EditOrderFormProps) {
  const [formData, setFormData] = useState({
    name: order.name || '',
    code: order.code || '',
    comments: order.comments || '',
    counterpartyId: order.counterpartyId ? String(order.counterpartyId) : '',
    status: order.status || 'active',
    destination: order.destination || '',
    warehouse: order.warehouse || '',
    expectedDelivery: order.expectedDelivery ? new Date(order.expectedDelivery).toISOString().split('T')[0] : ''
  });

  // Загружаем контрагентов
  const { data: counterparties = [] } = useQuery<any[]>({
    queryKey: ['/api/admin/counterparties'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updateData = {
      name: formData.name,
      code: formData.code,
      comments: formData.comments,
      counterpartyId: formData.counterpartyId && formData.counterpartyId !== 'none' 
        ? parseInt(formData.counterpartyId) 
        : null,
      status: formData.status,
      destination: formData.destination,
      expectedDelivery: formData.expectedDelivery || null
    };
    
    onUpdate(order.id, updateData);
  };

  const warehouses = ['Душанбе', 'Гуанчжоу', 'Фошань', 'Урумчи', 'Кашгар', 'Иу'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-screen overflow-y-auto">
        <CardHeader>
          <CardTitle>Редактировать заказ</CardTitle>
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
                  <SelectItem value="completed">Завершенный</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Комментарии</label>
              <Textarea
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                placeholder="Дополнительная информация о заказе"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Отмена
              </Button>
              <Button type="submit">
                Сохранить изменения
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}