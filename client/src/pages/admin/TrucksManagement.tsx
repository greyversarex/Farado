import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Truck, Plus, Edit, Trash2, Package, Gauge } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Truck as TruckType, InsertTruck } from "@shared/schema";

export function TrucksManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState<TruckType | null>(null);
  const [formData, setFormData] = useState<InsertTruck>({
    number: '',
    capacity: '0',
    status: 'Свободен'
  });

  const { data: trucks = [], isLoading } = useQuery<TruckType[]>({
    queryKey: ['/api/admin/trucks'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertTruck) => {
      const response = await apiRequest('/api/admin/trucks', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create truck');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/trucks'] });
      setIsCreateDialogOpen(false);
      setFormData({ number: '', capacity: '0', status: 'Свободен' });
      toast({
        title: "Успешно",
        description: "Грузовой трак создан",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: "Не удалось создать грузовой трак",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<TruckType> }) => {
      const response = await apiRequest(`/api/admin/trucks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update truck');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/trucks'] });
      setIsEditDialogOpen(false);
      setSelectedTruck(null);
      toast({
        title: "Успешно",
        description: "Грузовой трак обновлен",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest(`/api/admin/trucks/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete truck');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/trucks'] });
      toast({
        title: "Успешно",
        description: "Грузовой трак удален",
      });
    },
  });

  const handleCreate = () => {
    createMutation.mutate(formData);
  };

  const handleEdit = (truck: TruckType) => {
    setSelectedTruck(truck);
    setFormData({
      number: truck.number,
      capacity: truck.capacity,
      status: truck.status
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (selectedTruck) {
      updateMutation.mutate({
        id: selectedTruck.id,
        data: formData
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Вы уверены, что хотите удалить этот грузовой трак?')) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'В пути':
        return 'bg-blue-100 text-blue-800';
      case 'Свободен':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatNumber = (value: string | number): string => {
    if (!value) return '0';
    const num = parseFloat(value.toString());
    return num % 1 === 0 ? num.toString() : num.toFixed(3).replace(/\.?0+$/, '');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Truck className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Управление фурами</h2>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Добавить фуру
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Создать новую фуру</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="number">Номер грузового трака</Label>
                <Input
                  id="number"
                  value={formData.number}
                  onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                  placeholder="Введите номер"
                />
              </div>
              <div>
                <Label htmlFor="capacity">Вместимость (м³)</Label>
                <Input
                  id="capacity"
                  type="number"
                  step="0.001"
                  value={formData.capacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                  placeholder="0.000"
                />
              </div>
              <div>
                <Label htmlFor="status">Статус</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Свободен">Свободен</SelectItem>
                    <SelectItem value="В пути">В пути</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreate} disabled={createMutation.isPending} className="w-full">
                {createMutation.isPending ? 'Создание...' : 'Создать фуру'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="text-gray-500">Загрузка...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trucks.map((truck) => (
            <Card key={truck.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-blue-600" />
                    {truck.number}
                  </div>
                  <Badge className={getStatusColor(truck.status)}>
                    {truck.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Вместимость:</span>
                  </div>
                  <span className="font-medium">{formatNumber(truck.capacity)} м³</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Текущий объем:</span>
                  </div>
                  <span className="font-medium">{formatNumber(truck.currentVolume || '0')} м³</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ 
                      width: `${Math.min(100, (parseFloat(truck.currentVolume || '0') / parseFloat(truck.capacity)) * 100)}%` 
                    }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  {((parseFloat(truck.currentVolume || '0') / parseFloat(truck.capacity)) * 100).toFixed(1)}% заполнен
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(truck)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Изменить
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(truck.id)}
                    className="flex-1"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Удалить
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать фуру</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-number">Номер грузового трака</Label>
              <Input
                id="edit-number"
                value={formData.number}
                onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                placeholder="Введите номер"
              />
            </div>
            <div>
              <Label htmlFor="edit-capacity">Вместимость (м³)</Label>
              <Input
                id="edit-capacity"
                type="number"
                step="0.001"
                value={formData.capacity}
                onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                placeholder="0.000"
              />
            </div>
            <div>
              <Label htmlFor="edit-status">Статус</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Свободен">Свободен</SelectItem>
                  <SelectItem value="В пути">В пути</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending} className="w-full">
              {updateMutation.isPending ? 'Сохранение...' : 'Сохранить изменения'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}