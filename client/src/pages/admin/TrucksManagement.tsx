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
import { Truck, Plus, Edit, Trash2, Package, Gauge, FolderPlus, Upload, FolderOpen, ArrowLeft, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Truck as TruckType, InsertTruck } from "@shared/schema";

export function TrucksManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isTruckDetailsOpen, setIsTruckDetailsOpen] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState<TruckType | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [formData, setFormData] = useState<InsertTruck>({
    number: '',
    capacity: '0',
    status: 'Свободен'
  });

  const { data: trucks = [], isLoading } = useQuery<TruckType[]>({
    queryKey: ['/api/admin/trucks'],
  });

  // Загружаем товары для выбранной фуры  
  const { data: truckItems = [], isLoading: isLoadingItems, error: truckItemsError } = useQuery<any[]>({
    queryKey: [`/api/admin/trucks/${selectedTruck?.id}/items`],
    enabled: !!selectedTruck?.id && isTruckDetailsOpen,
    retry: 1,
  });

  // Загружаем папки и документы фуры
  const { data: truckFolders = [], isLoading: foldersLoading, refetch: refetchFolders } = useQuery<any[]>({
    queryKey: [`/api/admin/trucks/${selectedTruck?.id}/folders`],
    enabled: !!selectedTruck?.id && isTruckDetailsOpen,
  });

  const { data: truckDocuments = [], isLoading: documentsLoading, refetch: refetchDocuments } = useQuery<any[]>({
    queryKey: [`/api/admin/trucks/${selectedTruck?.id}/documents`],
    enabled: !!selectedTruck?.id && isTruckDetailsOpen,
  });

  // Фильтруем документы по выбранной папке
  const filteredDocuments = selectedFolderId 
    ? truckDocuments.filter((doc: any) => doc.folderId === selectedFolderId)
    : truckDocuments.filter((doc: any) => !doc.folderId);

  // Отладочная информация
  console.log('TrucksManagement Debug:', {
    selectedTruckId: selectedTruck?.id,
    isTruckDetailsOpen,
    truckItemsLength: truckItems.length,
    isLoadingItems,
    truckItemsError,
    queryEnabled: !!selectedTruck?.id && isTruckDetailsOpen,
    queryKey: `/api/admin/trucks/${selectedTruck?.id}/items`
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

  const handleViewTruck = (truck: TruckType) => {
    console.log('Opening truck details for:', truck.id, truck.number);
    setSelectedTruck(truck);
    setSelectedFolderId(null); // Сбрасываем выбранную папку при открытии
    setIsTruckDetailsOpen(true);
  };

  const calculateTruckLoad = (truck: TruckType, items: any[] = []) => {
    if (!items || items.length === 0) return { 
      totalWeight: formatNumber('0'), 
      totalVolume: formatNumber('0'),
      loadPercentage: 0 
    };
    
    let totalWeight = 0;
    let totalVolume = 0;

    items.forEach(item => {
      const volume = parseFloat(item.volume || '0') || 0;
      const weight = parseFloat(item.weight || '0') || 0;
      
      if (item.volumeType === 'cubic' || item.volumeType === 'm³') {
        totalVolume += volume;
      } else if (item.volumeType === 'kg') {
        totalWeight += volume; // В случае kg объем содержит вес
      }
      
      // Также добавляем вес из поля weight
      if (weight > 0) {
        totalWeight += weight;
      }
    });
    
    const capacity = parseFloat(truck.capacity || '0');
    const loadPercentage = capacity > 0 ? (totalVolume / capacity) * 100 : 0;
    
    return { 
      totalWeight: formatNumber(totalWeight.toString()), 
      totalVolume: formatNumber(totalVolume.toString()),
      loadPercentage: loadPercentage.toFixed(1) 
    };
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

  const createFolderMutation = useMutation({
    mutationFn: async (data: { truckId: number, name: string }) => {
      const response = await apiRequest(`/api/admin/trucks/${data.truckId}/folders`, {
        method: 'POST',
        body: JSON.stringify({ name: data.name }),
      });
      if (!response.ok) throw new Error('Failed to create folder');
      return response.json();
    },
    onSuccess: () => {
      refetchFolders();
      toast({
        title: "Успешно",
        description: "Папка создана",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось создать папку",
        variant: "destructive",
      });
    },
  });

  const createDocumentMutation = useMutation({
    mutationFn: async (data: { truckId: number, name: string, fileData: string, folderId?: number | null }) => {
      const response = await apiRequest(`/api/admin/trucks/${data.truckId}/documents`, {
        method: 'POST',
        body: JSON.stringify({ 
          name: data.name, 
          fileData: data.fileData,
          type: 'document',
          folderId: data.folderId || null
        }),
      });
      if (!response.ok) throw new Error('Failed to create document');
      return response.json();
    },
    onSuccess: () => {
      refetchDocuments();
      toast({
        title: "Успешно",
        description: "Файл загружен",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить файл",
        variant: "destructive",
      });
    },
  });

  const handleCreateFolder = () => {
    if (!selectedTruck) return;
    const folderName = prompt("Введите название папки:");
    if (folderName && folderName.trim()) {
      createFolderMutation.mutate({
        truckId: selectedTruck.id,
        name: folderName.trim()
      });
    }
  };

  const handleUploadFile = () => {
    if (!selectedTruck) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = false;
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const fileData = event.target?.result as string;
          createDocumentMutation.mutate({
            truckId: selectedTruck.id,
            name: file.name,
            fileData: fileData,
            folderId: selectedFolderId
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleFolderClick = (folderId: number) => {
    setSelectedFolderId(folderId);
  };

  const handleBackToRoot = () => {
    setSelectedFolderId(null);
  };

  const handleDownloadFile = (document: any) => {
    try {
      const link = document.createElement('a');
      link.href = document.fileData;
      link.download = document.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось скачать файл",
        variant: "destructive",
      });
    }
  };

  const deleteFolderMutation = useMutation({
    mutationFn: async ({ truckId, folderId }: { truckId: number, folderId: number }) => {
      const response = await apiRequest(`/api/admin/trucks/${truckId}/folders/${folderId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete folder');
      return response.json();
    },
    onSuccess: () => {
      refetchFolders();
      refetchDocuments();
      toast({
        title: "Успешно",
        description: "Папка удалена",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить папку",
        variant: "destructive",
      });
    },
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: async ({ truckId, documentId }: { truckId: number, documentId: number }) => {
      const response = await apiRequest(`/api/admin/trucks/${truckId}/documents/${documentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete document');
      return response.json();
    },
    onSuccess: () => {
      refetchDocuments();
      toast({
        title: "Успешно",
        description: "Файл удален",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить файл",
        variant: "destructive",
      });
    },
  });

  const handleDeleteFolder = (folderId: number) => {
    if (selectedTruck && confirm('Вы уверены, что хотите удалить эту папку? Все файлы в ней также будут удалены.')) {
      deleteFolderMutation.mutate({ truckId: selectedTruck.id, folderId });
    }
  };

  const handleDeleteDocument = (documentId: number) => {
    if (selectedTruck && confirm('Вы уверены, что хотите удалить этот файл?')) {
      deleteDocumentMutation.mutate({ truckId: selectedTruck.id, documentId });
    }
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
            <Card key={truck.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleViewTruck(truck)}>
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
                    <span className="text-sm text-gray-600">Текущий вес:</span>
                  </div>
                  <span className="font-medium">{formatNumber(truck.currentWeight || '0')} кг</span>
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(truck);
                    }}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Изменить
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(truck.id);
                    }}
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

      {/* Модальное окно для просмотра товаров фуры */}
      <Dialog open={isTruckDetailsOpen} onOpenChange={setIsTruckDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-600" />
              Фура {selectedTruck?.number} - Товары
            </DialogTitle>
          </DialogHeader>
          
          {selectedTruck && (
            <div className="space-y-4">
              {/* Информация о фуре */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-sm text-gray-600">Вместимость</div>
                  <div className="font-medium">{formatNumber(selectedTruck.capacity)} м³</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Общий вес</div>
                  <div className="font-medium">{calculateTruckLoad(selectedTruck!, truckItems).totalWeight} кг</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Объем</div>
                  <div className="font-medium">{formatNumber(selectedTruck.currentVolume || '0')} м³</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Заполненность</div>
                  <div className="font-medium">
                    {((parseFloat(selectedTruck.currentVolume || '0') / parseFloat(selectedTruck.capacity)) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Товары в фуре */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Товары в фуре</h3>
                <p className="text-xs text-gray-500 mb-2">
                  Загружено: {truckItems.length} товаров 
                  {truckItemsError && ` (Ошибка: ${truckItemsError})`}
                  {isLoadingItems && ' (Загрузка...)'}
                </p>
                
                {isLoadingItems ? (
                  <div className="flex justify-center py-8">
                    <div className="text-gray-500">Загрузка товаров...</div>
                  </div>
                ) : truckItems.length === 0 ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center text-red-600 mb-2">
                      <Package className="w-5 h-5 mr-2" />
                      <span className="font-medium">-</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Количество:</span>
                        <div className="font-medium">0 кг</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Вес:</span>
                        <div className="font-medium">0 кг</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Объём:</span>
                        <div className="font-medium">0 м³</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Статус:</span>
                        <div className="font-medium">Свободен</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {truckItems.map((item: any) => (
                      <Card key={item.id} className="border-l-4 border-l-red-500">
                        <CardHeader className="bg-red-500 text-white py-2">
                          <CardTitle className="text-sm font-medium">
                            {item.code} - {item.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-3">
                            <div>
                              <span className="text-gray-600">Количество:</span>
                              <div className="font-medium">{item.quantity}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Вес:</span>
                              <div className="font-medium">{formatNumber(item.weight)} кг</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Объем:</span>
                              <div className="font-medium">{formatNumber(item.volume)} м³</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Статус:</span>
                              <div className="font-medium">{item.status}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Контрагент:</span>
                              <div className="font-medium">{item.counterpartyName || 'Не указан'}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Срок доставки:</span>
                              <div className="font-medium">
                                {item.expectedDelivery ? new Date(item.expectedDelivery).toLocaleDateString() : 'Не указан'}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Папки и материалы */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">Материалы и документы</h3>
                    {selectedFolderId && (
                      <Button size="sm" variant="ghost" onClick={handleBackToRoot}>
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Назад
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!selectedFolderId && (
                      <Button size="sm" variant="outline" onClick={handleCreateFolder}>
                        <FolderPlus className="h-4 w-4 mr-1" />
                        Создать папку
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={handleUploadFile}>
                      <Upload className="h-4 w-4 mr-1" />
                      Загрузить файл
                    </Button>
                  </div>
                </div>
                {(foldersLoading || documentsLoading) ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Загрузка...</p>
                  </div>
                ) : (selectedFolderId ? filteredDocuments : [...truckFolders, ...filteredDocuments]).length === 0 ? (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                    <FolderOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>
                      {selectedFolderId 
                        ? "В этой папке пока нет файлов. Загрузите первый файл." 
                        : "Пока нет папок и документов. Создайте первую папку или загрузите файл."
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {!selectedFolderId && (
                      <>
                        {/* Папки */}
                        {truckFolders.map((folder: any) => (
                          <Card 
                            key={folder.id} 
                            className="border-l-4 border-l-blue-500 cursor-pointer hover:bg-gray-50"
                            onClick={() => handleFolderClick(folder.id)}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <FolderOpen className="h-4 w-4 text-blue-500" />
                                  <span className="font-medium">{folder.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="destructive" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteFolder(folder.id);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                  <div className="text-xs text-gray-500">
                                    {new Date(folder.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </>
                    )}

                    {/* Документы */}
                    {filteredDocuments.map((document: any) => (
                      <Card key={document.id} className="border-l-4 border-l-green-500">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Upload className="h-4 w-4 text-green-500" />
                              <span className="font-medium">{document.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => handleDownloadFile(document)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteDocument(document.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <div className="text-xs text-gray-500">
                                {new Date(document.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}