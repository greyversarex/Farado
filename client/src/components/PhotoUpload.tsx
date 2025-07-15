import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, X, Upload, Plus } from 'lucide-react';

interface PhotoUploadProps {
  onPhotosChange: (photos: string[]) => void;
  existingPhotos?: string[];
  maxPhotos?: number;
}

export function PhotoUpload({ onPhotosChange, existingPhotos = [], maxPhotos = 5 }: PhotoUploadProps) {
  const [photos, setPhotos] = useState<string[]>(existingPhotos);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    console.log('Files selected:', files.length);
    setUploading(true);
    const newPhotos: string[] = [];

    try {
      for (let i = 0; i < Math.min(files.length, maxPhotos - photos.length); i++) {
        const file = files[i];
        console.log('Processing file:', file.name, file.type, file.size);
        
        if (file.type.startsWith('image/')) {
          // Размер файла не ограничен
          console.log('Processing file:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2) + 'MB');
          
          try {
            const base64 = await fileToBase64(file);
            console.log('Converted to base64, length:', base64.length);
            newPhotos.push(base64);
          } catch (error) {
            console.error('Error converting file to base64:', error);
          }
        }
      }

      if (newPhotos.length > 0) {
        const updatedPhotos = [...photos, ...newPhotos];
        console.log('Updating photos, total count:', updatedPhotos.length);
        setPhotos(updatedPhotos);
        onPhotosChange(updatedPhotos);
      }
    } catch (error) {
      console.error('Error processing files:', error);
    } finally {
      setUploading(false);
      // Очищаем input для возможности повторного выбора того же файла
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        console.log('FileReader result type:', typeof result, 'length:', result?.length);
        resolve(result);
      };
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    console.log('Removing photo at index:', index);
    const updatedPhotos = photos.filter((_, i) => i !== index);
    console.log('Updated photos count:', updatedPhotos.length);
    setPhotos(updatedPhotos);
    onPhotosChange(updatedPhotos);
  };

  const triggerFileInput = () => {
    console.log('Triggering file input');
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Фотографии</span>
          <span className="text-xs text-gray-500">{photos.length}/{maxPhotos}</span>
        </div>
        
        {/* Upload Button */}
        {photos.length < maxPhotos && (
          <Button
            type="button"
            variant="outline"
            onClick={triggerFileInput}
            disabled={uploading}
            className="w-full border-dashed border-2 h-20 flex flex-col gap-2"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-xs">Загрузка...</span>
              </>
            ) : (
              <>
                <Plus className="w-6 h-6 text-gray-400" />
                <span className="text-sm">Добавить фото</span>
              </>
            )}
          </Button>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {photos.map((photo, index) => (
            <div key={index} className="relative group border border-gray-200 rounded-lg overflow-hidden">
              <img
                src={photo}
                alt={`Фото ${index + 1}`}
                className="w-full h-24 object-cover"
                onError={(e) => {
                  console.error('Image load error:', e);
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiAxNkM4LjY4NjI5IDE2IDYgMTMuMzEzNyA2IDEwQzYgNi42ODYyOSA4LjY4NjI5IDQgMTIgNEMxNS4zMTM3IDQgMTggNi42ODYyOSAxOCAxMEMxOCAxMy4zMTM3IDE1LjMxMzcgMTYgMTIgMTZaTTEyIDZDOS43OTA4NiA2IDggNy43OTA4NiA4IDEwQzggMTIuMjA5MSA5Ljc5MDg2IDE0IDEyIDE0QzE0LjIwOTEgMTQgMTYgMTIuMjA5MSAxNiAxMEMxNiA3Ljc5MDg2IDE0LjIwOTEgNiAxMiA2WiIgZmlsbD0iIzk5QTNBRiIvPgo8L3N2Zz4K';
                }}
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removePhoto(index)}
                className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="text-center">
        <p className="text-xs text-gray-500">
          Максимум {maxPhotos} фотографий. Поддерживаются форматы: JPG, PNG, GIF
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Размер файла не ограничен
        </p>
      </div>
    </div>
  );
}