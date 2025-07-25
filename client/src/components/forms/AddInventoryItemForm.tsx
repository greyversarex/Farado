import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload } from 'lucide-react';

interface AddInventoryItemFormProps {
  onClose: () => void;
  onSubmit: (itemData: any) => void;
  warehouse: string;
}

export function AddInventoryItemForm({ onClose, onSubmit, warehouse }: AddInventoryItemFormProps) {
  const [formData, setFormData] = useState({
    warehouse,
    code: '',
    name: '',
    description: '',
    characteristics: '',
    quantity: 1,
    availableQuantity: 1,
    volumeType: 'kg',
    pricePerUnit: '',
    volume: '',
    deliveryPeriod: '',
    transport: 'Авто'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      quantity: parseInt(formData.quantity.toString()),
      availableQuantity: parseInt(formData.availableQuantity.toString()),
      pricePerUnit: parseFloat(formData.pricePerUnit) || 0,
      volume: parseFloat(formData.volume) || 0
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-3xl max-h-screen overflow-y-auto">
        <CardHeader>
          <CardTitle>Добавить товар на склад: {warehouse}</CardTitle>
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



                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="quantity">Общее количество*</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => {
                        const qty = parseInt(e.target.value) || 1;
                        setFormData(prev => ({ 
                          ...prev, 
                          quantity: qty,
                          availableQuantity: Math.min(prev.availableQuantity, qty)
                        }));
                      }}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="availableQuantity">Доступно*</Label>
                    <Input
                      id="availableQuantity"
                      type="number"
                      min="0"
                      max={formData.quantity}
                      value={formData.availableQuantity}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        availableQuantity: Math.min(parseInt(e.target.value) || 0, prev.quantity) 
                      }))}
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
                  <Select value={formData.transport} onValueChange={(value) => setFormData(prev => ({ ...prev, transport: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите транспорт" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Авто">Авто</SelectItem>
                      <SelectItem value="Авиа">Авиа</SelectItem>
                    </SelectContent>
                  </Select>
                </div>


              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <Label>Добавить фото</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  Перетащите фото сюда или нажмите для выбора
                </p>
                <input type="file" multiple accept="image/*" className="hidden" />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">Добавить на склад</Button>
              <Button type="button" variant="outline" onClick={onClose}>Отмена</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}