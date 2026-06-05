import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Plus, Edit, Trash2, MapPin, Package, BarChart3, Upload, X } from 'lucide-react';
import type { Hub } from '@shared/schema';

const emptyForm = {
  name: '',
  nameChinese: '',
  description: '',
  pricePerKg: '',
  pricePerCubic: '',
  image: '',
  sortOrder: 0,
};

export default function HubsManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingHub, setEditingHub] = useState<Hub | null>(null);
  const [deletingHub, setDeletingHub] = useState<Hub | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState<string>('');

  const { data: hubList = [], isLoading } = useQuery<Hub[]>({
    queryKey: ['/api/admin/hubs'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof emptyForm) => {
      const res = await apiRequest('/api/admin/hubs', { method: 'POST', body: JSON.stringify(data) });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/hubs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/hubs'] });
      setIsDialogOpen(false);
      toast({ title: 'Готово', description: 'Хаб добавлен' });
    },
    onError: () => toast({ title: 'Ошибка', description: 'Не удалось создать хаб', variant: 'destructive' }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: typeof emptyForm }) => {
      const res = await apiRequest(`/api/admin/hubs/${id}`, { method: 'PUT', body: JSON.stringify(data) });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/hubs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/hubs'] });
      setIsDialogOpen(false);
      toast({ title: 'Готово', description: 'Хаб обновлён' });
    },
    onError: () => toast({ title: 'Ошибка', description: 'Не удалось обновить хаб', variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/admin/hubs/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/hubs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/hubs'] });
      setIsDeleteDialogOpen(false);
      toast({ title: 'Готово', description: 'Хаб удалён' });
    },
    onError: () => toast({ title: 'Ошибка', description: 'Не удалось удалить хаб', variant: 'destructive' }),
  });

  const openCreate = () => {
    setEditingHub(null);
    setForm(emptyForm);
    setImagePreview('');
    setIsDialogOpen(true);
  };

  const openEdit = (hub: Hub) => {
    setEditingHub(hub);
    setForm({
      name: hub.name,
      nameChinese: hub.nameChinese,
      description: hub.description,
      pricePerKg: hub.pricePerKg,
      pricePerCubic: hub.pricePerCubic,
      image: hub.image,
      sortOrder: hub.sortOrder ?? 0,
    });
    setImagePreview(hub.image);
    setIsDialogOpen(true);
  };

  const openDelete = (hub: Hub) => {
    setDeletingHub(hub);
    setIsDeleteDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setImagePreview(result);
      setForm((f) => ({ ...f, image: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.pricePerKg || !form.pricePerCubic || !form.image) {
      toast({ title: 'Ошибка', description: 'Заполните все обязательные поля', variant: 'destructive' });
      return;
    }
    if (editingHub) {
      updateMutation.mutate({ id: editingHub.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Управление хабами</h2>
          <p className="text-gray-500 text-sm mt-1">Логистические центры в Китае</p>
        </div>
        <Button onClick={openCreate} className="bg-red-600 hover:bg-red-700">
          <Plus className="w-4 h-4 mr-2" />
          Добавить хаб
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
        </div>
      ) : hubList.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Хабы ещё не добавлены</p>
            <Button onClick={openCreate} variant="outline" className="mt-4">
              <Plus className="w-4 h-4 mr-2" /> Добавить первый хаб
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hubList.map((hub) => (
            <Card key={hub.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="relative h-44 overflow-hidden">
                <img
                  src={hub.image}
                  alt={hub.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <div className="flex items-center gap-1 mb-0.5">
                    <MapPin className="w-4 h-4 text-white" />
                    <span className="text-white font-bold text-lg">{hub.name}</span>
                  </div>
                  <span className="text-white/80 text-sm">{hub.nameChinese}</span>
                </div>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-7 w-7 p-0 bg-white/90 hover:bg-white"
                    onClick={() => openEdit(hub)}
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-7 w-7 p-0 bg-red-600/90 hover:bg-red-700"
                    onClick={() => openDelete(hub)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">{hub.description}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-red-600 rounded-lg p-2.5 text-center">
                    <div className="flex items-center justify-center gap-1 mb-0.5">
                      <Package className="w-3 h-3 text-white" />
                      <span className="text-xs text-white">за кг</span>
                    </div>
                    <span className="text-lg font-bold text-white">${hub.pricePerKg}</span>
                  </div>
                  <div className="bg-red-600 rounded-lg p-2.5 text-center">
                    <div className="flex items-center justify-center gap-1 mb-0.5">
                      <BarChart3 className="w-3 h-3 text-white" />
                      <span className="text-xs text-white">за м³</span>
                    </div>
                    <span className="text-lg font-bold text-white">${hub.pricePerCubic}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => openEdit(hub)}>
                    <Edit className="w-3.5 h-3.5 mr-1" /> Редактировать
                  </Button>
                  <Button size="sm" variant="destructive" className="flex-1" onClick={() => openDelete(hub)}>
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Удалить
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingHub ? 'Редактировать хаб' : 'Добавить хаб'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image Upload */}
            <div>
              <Label>Изображение города *</Label>
              <div className="mt-2">
                {imagePreview ? (
                  <div className="relative rounded-lg overflow-hidden h-48 bg-gray-100">
                    <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setImagePreview(''); setForm((f) => ({ ...f, image: '' })); }}
                      className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-48 border-2 border-dashed border-gray-300 hover:border-red-400 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Upload className="w-8 h-8" />
                    <span className="text-sm">Нажмите для загрузки фото города</span>
                    <span className="text-xs text-gray-400">JPG, PNG, WebP до 10 МБ</span>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-3.5 h-3.5 mr-1" /> Сменить фото
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Название (рус) *</Label>
                <Input
                  className="mt-1"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Гуанчжоу"
                />
              </div>
              <div>
                <Label>Название (китайский) *</Label>
                <Input
                  className="mt-1"
                  value={form.nameChinese}
                  onChange={(e) => setForm((f) => ({ ...f, nameChinese: e.target.value }))}
                  placeholder="广州"
                />
              </div>
            </div>

            <div>
              <Label>Описание *</Label>
              <Textarea
                className="mt-1"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Описание хаба и его специализация..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Цена за кг ($) *</Label>
                <Input
                  className="mt-1"
                  value={form.pricePerKg}
                  onChange={(e) => setForm((f) => ({ ...f, pricePerKg: e.target.value }))}
                  placeholder="1.2"
                />
              </div>
              <div>
                <Label>Цена за м³ ($) *</Label>
                <Input
                  className="mt-1"
                  value={form.pricePerCubic}
                  onChange={(e) => setForm((f) => ({ ...f, pricePerCubic: e.target.value }))}
                  placeholder="220"
                />
              </div>
            </div>

            <div>
              <Label>Порядок сортировки</Label>
              <Input
                className="mt-1"
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm((f) => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))}
                placeholder="0"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Отмена</Button>
              <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={isPending}>
                {isPending ? 'Сохранение...' : editingHub ? 'Сохранить' : 'Добавить'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить хаб</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            Вы уверены, что хотите удалить хаб <strong>{deletingHub?.name}</strong>? Это действие необратимо.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Отмена</Button>
            <Button
              variant="destructive"
              onClick={() => deletingHub && deleteMutation.mutate(deletingHub.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Удаление...' : 'Удалить'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
