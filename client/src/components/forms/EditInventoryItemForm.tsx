import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

interface EditInventoryItemFormProps {
  item: any;
  onClose: () => void;
  onUpdate: (itemData: any) => void;
}

export function EditInventoryItemForm({ item, onClose, onUpdate }: EditInventoryItemFormProps) {
  const [formData, setFormData] = useState({
    code: item.code || '',
    name: item.name || '',
    description: item.description || '',
    characteristics: item.characteristics || '',
    quantity: item.quantity || 1,
    availableQuantity: item.availableQuantity || 1,
    volumeType: item.volumeType || 'kg',
    pricePerUnit: item.pricePerUnit || '',
    volume: item.volume || '',
    deliveryPeriod: item.deliveryPeriod || '',
    transport: item.transport || ''
  });

  const calculateTotal = () => {
    const price = parseFloat(formData.pricePerUnit) || 0;
    const volume = parseFloat(formData.volume) || 0;
    return (price * volume).toFixed(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      id: item.id,
      warehouse: item.warehouse,
      ...formData,
      quantity: parseInt(formData.quantity.toString()),
      availableQuantity: parseInt(formData.availableQuantity.toString()),
      pricePerUnit: parseFloat(formData.pricePerUnit) || 0,
      volume: parseFloat(formData.volume) || 0
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-screen overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Изменить товар на складе: {item.name}</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="code">Код товара*</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="name">Название товара*</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Краткое описание товара"
                  />
                </div>

                <div>
                  <Label htmlFor="characteristics">Характеристики</Label>
                  <Textarea
                    id="characteristics"
                    value={formData.characteristics}
                    onChange={(e) => setFormData(prev => ({ ...prev, characteristics: e.target.value }))}
                    placeholder="Размер, цвет, материал и т.д."
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="quantity">Общее количество</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="availableQuantity">Доступно</Label>
                    <Input
                      id="availableQuantity"
                      type="number"
                      min="0"
                      max={formData.quantity}
                      value={formData.availableQuantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, availableQuantity: parseInt(e.target.value) || 0 }))}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Тип объема</Label>
                    <Select value={formData.volumeType} onValueChange={(value) => setFormData(prev => ({ ...prev, volumeType: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">кг</SelectItem>
                        <SelectItem value="cubic">куб</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="volume">Объем/Вес</Label>
                    <Input
                      id="volume"
                      type="number"
                      step="0.001"
                      value={formData.volume}
                      onChange={(e) => setFormData(prev => ({ ...prev, volume: e.target.value }))}
                      placeholder="0.5"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="pricePerUnit">
                    Цена за {formData.volumeType === 'kg' ? 'кг' : 'куб'}
                  </Label>
                  <Input
                    id="pricePerUnit"
                    type="number"
                    step="0.01"
                    value={formData.pricePerUnit}
                    onChange={(e) => setFormData(prev => ({ ...prev, pricePerUnit: e.target.value }))}
                    placeholder="100.00"
                  />
                </div>

                <div>
                  <Label htmlFor="deliveryPeriod">Срок доставки</Label>
                  <Input
                    id="deliveryPeriod"
                    value={formData.deliveryPeriod}
                    onChange={(e) => setFormData(prev => ({ ...prev, deliveryPeriod: e.target.value }))}
                    placeholder="7-10 дней"
                  />
                </div>

                <div>
                  <Label htmlFor="transport">Транспорт</Label>
                  <Input
                    id="transport"
                    value={formData.transport}
                    onChange={(e) => setFormData(prev => ({ ...prev, transport: e.target.value }))}
                    placeholder="Авиа, Авто, ЖД"
                  />
                </div>

                <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <Label className="text-sm font-medium text-green-800">Стоимость за единицу</Label>
                  <div className="mt-2 space-y-1">
                    <div className="text-2xl font-bold text-green-600">
                      {calculateTotal()} USD
                    </div>
                    <div className="text-sm text-green-700">
                      {formData.pricePerUnit || '0'} USD/{formData.volumeType} × {formData.volume || '0'} {formData.volumeType}
                    </div>
                    <div className="text-xs text-green-600">
                      Автоматическое обновление
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">Сохранить изменения</Button>
              <Button type="button" variant="outline" onClick={onClose}>Отмена</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}