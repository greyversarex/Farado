import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FolderPlus, Upload, FolderOpen, ArrowLeft, Download, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OrderDocumentsProps {
  orderId: number;
  orderName: string;
}

export function OrderDocuments({ orderId, orderName }: OrderDocumentsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);

  // Fetch folders
  const { data: folders = [], isLoading: foldersLoading, refetch: refetchFolders } = useQuery<any[]>({
    queryKey: [`/api/admin/orders/${orderId}/folders`],
    enabled: !!orderId,
  });

  // Fetch documents
  const { data: documents = [], isLoading: documentsLoading, refetch: refetchDocuments } = useQuery<any[]>({
    queryKey: [`/api/admin/orders/${orderId}/documents`],
    enabled: !!orderId,
  });

  const filteredDocuments = selectedFolderId 
    ? documents.filter(doc => doc.folderId === selectedFolderId)
    : documents.filter(doc => !doc.folderId);

  const createFolderMutation = useMutation({
    mutationFn: async (data: { orderId: number, name: string }) => {
      const response = await apiRequest(`/api/admin/orders/${data.orderId}/folders`, {
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
    mutationFn: async (data: { orderId: number, name: string, fileData: string, folderId?: number | null }) => {
      const response = await apiRequest(`/api/admin/orders/${data.orderId}/documents`, {
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

  const deleteFolderMutation = useMutation({
    mutationFn: async ({ orderId, folderId }: { orderId: number, folderId: number }) => {
      const response = await apiRequest(`/api/admin/orders/${orderId}/folders/${folderId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete folder');
      return response.json();
    },
    onSuccess: () => {
      refetchFolders();
      refetchDocuments();
      setSelectedFolderId(null); // Return to root when folder is deleted
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
    mutationFn: async ({ orderId, documentId }: { orderId: number, documentId: number }) => {
      const response = await apiRequest(`/api/admin/orders/${orderId}/documents/${documentId}`, {
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

  const handleCreateFolder = () => {
    const folderName = prompt("Введите название папки:");
    if (folderName && folderName.trim()) {
      createFolderMutation.mutate({
        orderId,
        name: folderName.trim()
      });
    }
  };

  const handleUploadFile = () => {
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
            orderId,
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

  const handleDeleteFolder = (folderId: number) => {
    if (confirm('Вы уверены, что хотите удалить эту папку? Все файлы в ней также будут удалены.')) {
      deleteFolderMutation.mutate({ orderId, folderId });
    }
  };

  const handleDeleteDocument = (documentId: number) => {
    if (confirm('Вы уверены, что хотите удалить этот файл?')) {
      deleteDocumentMutation.mutate({ orderId, documentId });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Документы заказа: {orderName}</h3>
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
      ) : (selectedFolderId ? filteredDocuments : [...folders, ...filteredDocuments]).length === 0 ? (
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
              {folders.map((folder: any) => (
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
  );
}