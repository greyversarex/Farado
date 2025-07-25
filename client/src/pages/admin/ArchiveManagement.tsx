import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Archive, Folder, FileText, Image, Plus, Upload, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ArchiveFolder, ArchiveMaterial, InsertArchiveFolder, InsertArchiveMaterial } from "@shared/schema";

export function ArchiveManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [folderFormData, setFolderFormData] = useState<InsertArchiveFolder>({
    name: '',
    path: '',
    parentId: null
  });
  const [materialFormData, setMaterialFormData] = useState<InsertArchiveMaterial>({
    name: '',
    type: 'document',
    folderId: null,
    fileData: '',
    description: ''
  });

  const { data: folders = [], isLoading: foldersLoading } = useQuery<ArchiveFolder[]>({
    queryKey: ['/api/admin/archive/folders', selectedFolderId],
    queryFn: async () => {
      const url = selectedFolderId 
        ? `/api/admin/archive/folders?parentId=${selectedFolderId}`
        : '/api/admin/archive/folders';
      const response = await apiRequest(url);
      if (!response.ok) throw new Error('Failed to fetch folders');
      return response.json();
    }
  });

  const { data: materials = [], isLoading: materialsLoading } = useQuery<ArchiveMaterial[]>({
    queryKey: ['/api/admin/archive/materials', selectedFolderId],
    queryFn: async () => {
      const url = selectedFolderId 
        ? `/api/admin/archive/materials?folderId=${selectedFolderId}`
        : '/api/admin/archive/materials';
      const response = await apiRequest(url);
      if (!response.ok) throw new Error('Failed to fetch materials');
      return response.json();
    }
  });

  const createFolderMutation = useMutation({
    mutationFn: async (data: InsertArchiveFolder) => {
      const response = await apiRequest('/api/admin/archive/folders', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create folder');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/archive/folders'] });
      setIsCreateFolderDialogOpen(false);
      setFolderFormData({ name: '', path: '', parentId: null });
      toast({
        title: "Успешно",
        description: "Папка создана",
      });
    },
  });

  const createMaterialMutation = useMutation({
    mutationFn: async (data: InsertArchiveMaterial) => {
      const response = await apiRequest('/api/admin/archive/materials', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create material');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/archive/materials'] });
      setIsUploadDialogOpen(false);
      setMaterialFormData({ name: '', type: 'document', folderId: null, fileData: '', description: '' });
      toast({
        title: "Успешно",
        description: "Материал загружен",
      });
    },
  });

  const deleteFolderMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest(`/api/admin/archive/folders/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete folder');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/archive/folders'] });
      toast({
        title: "Успешно",
        description: "Папка удалена",
      });
    },
  });

  const deleteMaterialMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest(`/api/admin/archive/materials/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete material');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/archive/materials'] });
      toast({
        title: "Успешно",
        description: "Материал удален",
      });
    },
  });

  const handleCreateFolder = () => {
    const path = selectedFolderId ? `${selectedFolderId}/${folderFormData.name}` : folderFormData.name;
    createFolderMutation.mutate({
      ...folderFormData,
      path,
      parentId: selectedFolderId
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setMaterialFormData(prev => ({
          ...prev,
          name: file.name,
          fileData: result,
          type: file.type.startsWith('image/') ? 'photo' : 'document',
          mimeType: file.type,
          fileSize: file.size
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadMaterial = () => {
    createMaterialMutation.mutate({
      ...materialFormData,
      folderId: selectedFolderId
    });
  };

  const getMaterialIcon = (type: string) => {
    return type === 'photo' ? <Image className="h-4 w-4" /> : <FileText className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold">Архив</h2>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 items-stretch sm:items-center">
          {selectedFolderId && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedFolderId(null)}
              className="mobile-button"
            >
              ← Назад
            </Button>
          )}
          <Dialog open={isCreateFolderDialogOpen} onOpenChange={setIsCreateFolderDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="mobile-button">
                <Folder className="w-4 h-4 mr-2" />
                <span className="text-sm">Создать папку</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Создать новую папку</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="folder-name">Название папки</Label>
                  <Input
                    id="folder-name"
                    value={folderFormData.name}
                    onChange={(e) => setFolderFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Введите название папки"
                  />
                </div>
                <Button onClick={handleCreateFolder} disabled={createFolderMutation.isPending} className="w-full">
                  {createFolderMutation.isPending ? 'Создание...' : 'Создать папку'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="mobile-button">
                <Upload className="w-4 h-4 mr-2" />
                <span className="text-sm">Загрузить файл</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Загрузить материал</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="file-upload">Выберите файл</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    onChange={handleFileUpload}
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />
                </div>
                {materialFormData.name && (
                  <>
                    <div>
                      <Label htmlFor="material-name">Название</Label>
                      <Input
                        id="material-name"
                        value={materialFormData.name}
                        onChange={(e) => setMaterialFormData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="material-description">Описание</Label>
                      <Textarea
                        id="material-description"
                        value={materialFormData.description || ''}
                        onChange={(e) => setMaterialFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Добавьте описание материала"
                      />
                    </div>
                    <Button onClick={handleUploadMaterial} disabled={createMaterialMutation.isPending} className="w-full">
                      {createMaterialMutation.isPending ? 'Загрузка...' : 'Загрузить файл'}
                    </Button>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {(foldersLoading || materialsLoading) ? (
        <div className="flex justify-center py-8">
          <div className="text-gray-500">Загрузка...</div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Папки */}
          {folders.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Folder className="h-5 w-5" />
                Папки
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {folders.map((folder) => (
                  <Card 
                    key={folder.id} 
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedFolderId(folder.id)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Folder className="h-5 w-5 text-yellow-600" />
                          {folder.name}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Вы уверены, что хотите удалить эту папку?')) {
                              deleteFolderMutation.mutate(folder.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Материалы */}
          {materials.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Материалы
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {materials.map((material) => (
                  <Card key={material.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getMaterialIcon(material.type)}
                          <span className="truncate">{material.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm('Вы уверены, что хотите удалить этот материал?')) {
                              deleteMaterialMutation.mutate(material.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Badge variant={material.type === 'photo' ? 'default' : 'secondary'}>
                          {material.type === 'photo' ? 'Фото' : 'Документ'}
                        </Badge>
                        {material.fileSize && (
                          <div className="text-sm text-gray-500">
                            {formatFileSize(material.fileSize)}
                          </div>
                        )}
                        {material.description && (
                          <div className="text-sm text-gray-600 line-clamp-2">
                            {material.description}
                          </div>
                        )}
                        {material.fileData && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = material.fileData!;
                              link.download = material.name;
                              link.click();
                            }}
                          >
                            Скачать
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {folders.length === 0 && materials.length === 0 && (
            <div className="text-center py-12">
              <Archive className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Папка пуста</h3>
              <p className="text-gray-500 mb-4">Создайте папку или загрузите файлы для начала работы с архивом</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}