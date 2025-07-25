import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User } from 'lucide-react';

interface ItemChangeHistoryProps {
  itemId: number;
  authHeaders?: any;
}

export function ItemChangeHistory({ itemId, authHeaders }: ItemChangeHistoryProps) {
  const { data: changeHistory = [], isLoading } = useQuery({
    queryKey: ['/api/admin/change-history/item', itemId],
    queryFn: async () => {
      const headers = authHeaders || {
        'username': localStorage.getItem('adminUsername') || '',
        'password': localStorage.getItem('adminPassword') || ''
      };
      const response = await fetch(`/api/admin/change-history/item/${itemId}`, {
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch change history');
      }
      return response.json();
    },
    enabled: !!itemId
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            История изменений
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Загрузка...</p>
        </CardContent>
      </Card>
    );
  }

  if (!changeHistory.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            История изменений
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Нет записей об изменениях</p>
        </CardContent>
      </Card>
    );
  }

  const getFieldDisplayName = (field: string) => {
    const fieldNames: { [key: string]: string } = {
      name: 'Название',
      quantity: 'Количество',
      pricePerUnit: 'Цена за единицу',
      totalPrice: 'Общая стоимость',
      status: 'Статус',
      destination: 'Пункт назначения',
      transport: 'Тип транспорта',
      characteristics: 'Характеристики',
      volume: 'Объем',
      weight: 'Вес',
      shipmentDate: 'Дата отправки',
      expectedDeliveryDate: 'Ожидаемая дата доставки',
      paymentStatus: 'Статус оплаты',
      comments: 'Комментарии',
      deliveryPeriod: 'Период доставки',
      transportPrice: 'Цена перевозки',
      totalTransportCost: 'Общая стоимость транспорта',
      volumeType: 'Тип измерения',
      totalAmount: 'Итоговая сумма',
      remainingAmount: 'Остаток'
    };
    return fieldNames[field] || field;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          История изменений
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {changeHistory.map((change: any) => (
            <div key={change.id} className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{change.username || 'Неизвестный пользователь'}</span>
                  <Badge variant="outline" className="text-xs">
                    {getFieldDisplayName(change.fieldChanged)}
                  </Badge>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(change.createdAt).toLocaleString('ru-RU')}
                </span>
              </div>
              <div className="text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-500">Было: </span>
                    <span className="text-red-600 line-through">
                      {change.oldValue || 'не указано'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Стало: </span>
                    <span className="text-green-600 font-medium">
                      {change.newValue || 'не указано'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}