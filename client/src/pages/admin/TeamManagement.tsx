import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Plus, Edit, Trash2, Users, Upload, X } from 'lucide-react';
import type { TeamMember } from '@shared/schema';

const emptyForm = {
  name: '',
  position: '',
  experience: '',
  description: '',
  image: '',
  imagePosition: 'object-center',
  sortOrder: 0,
};

const IMAGE_POSITIONS = [
  { value: 'object-center', label: 'По центру' },
  { value: 'object-top', label: 'Сверху' },
  { value: 'object-bottom', label: 'Снизу' },
  { value: 'object-[center_30%]', label: 'Центр-верх 30%' },
  { value: 'object-[center_35%]', label: 'Центр-верх 35%' },
  { value: 'object-[center_40%]', label: 'Центр-верх 40%' },
];

export default function TeamManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [deletingMember, setDeletingMember] = useState<TeamMember | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState<string>('');

  const { data: members = [], isLoading } = useQuery<TeamMember[]>({
    queryKey: ['/api/admin/team'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof emptyForm) => {
      const res = await apiRequest('/api/admin/team', { method: 'POST', body: JSON.stringify(data) });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/team'] });
      queryClient.invalidateQueries({ queryKey: ['/api/team'] });
      setIsDialogOpen(false);
      toast({ title: 'Готово', description: 'Сотрудник добавлен' });
    },
    onError: () => toast({ title: 'Ошибка', description: 'Не удалось создать сотрудника', variant: 'destructive' }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: typeof emptyForm }) => {
      const res = await apiRequest(`/api/admin/team/${id}`, { method: 'PUT', body: JSON.stringify(data) });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/team'] });
      queryClient.invalidateQueries({ queryKey: ['/api/team'] });
      setIsDialogOpen(false);
      toast({ title: 'Готово', description: 'Данные сотрудника обновлены' });
    },
    onError: () => toast({ title: 'Ошибка', description: 'Не удалось обновить данные', variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/admin/team/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/team'] });
      queryClient.invalidateQueries({ queryKey: ['/api/team'] });
      setIsDeleteDialogOpen(false);
      toast({ title: 'Готово', description: 'Сотрудник удалён' });
    },
    onError: () => toast({ title: 'Ошибка', description: 'Не удалось удалить сотрудника', variant: 'destructive' }),
  });

  const openCreate = () => {
    setEditingMember(null);
    setForm(emptyForm);
    setImagePreview('');
    setIsDialogOpen(true);
  };

  const openEdit = (member: TeamMember) => {
    setEditingMember(member);
    setForm({
      name: member.name,
      position: member.position,
      experience: member.experience,
      description: member.description,
      image: member.image,
      imagePosition: member.imagePosition ?? 'object-center',
      sortOrder: member.sortOrder ?? 0,
    });
    setImagePreview(member.image);
    setIsDialogOpen(true);
  };

  const openDelete = (member: TeamMember) => {
    setDeletingMember(member);
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
    if (!form.name || !form.position || !form.experience || !form.description || !form.image) {
      toast({ title: 'Ошибка', description: 'Заполните все обязательные поля и загрузите фото', variant: 'destructive' });
      return;
    }
    if (editingMember) {
      updateMutation.mutate({ id: editingMember.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Управление командой</h2>
          <p className="text-gray-500 text-sm mt-1">Сотрудники отображаются на странице «О нас»</p>
        </div>
        <Button onClick={openCreate} className="bg-red-600 hover:bg-red-700">
          <Plus className="w-4 h-4 mr-2" />
          Добавить сотрудника
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
        </div>
      ) : members.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Сотрудники ещё не добавлены</p>
            <Button onClick={openCreate} variant="outline" className="mt-4">
              <Plus className="w-4 h-4 mr-2" /> Добавить первого сотрудника
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <Card key={member.id} className="bg-white hover:shadow-lg transition-shadow group">
              <CardContent className="p-6 text-center">
                {/* Circular photo */}
                <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-4 border-gray-100 group-hover:border-red-100 transition-colors">
                  <img
                    src={member.image}
                    alt={member.name}
                    className={`w-full h-full object-cover ${member.imagePosition ?? 'object-center'}`}
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                <div className="text-red-600 font-medium text-sm mb-1">{member.position}</div>
                <div className="text-xs text-gray-500 mb-3">{member.experience}</div>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">{member.description}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => openEdit(member)}>
                    <Edit className="w-3.5 h-3.5 mr-1" /> Изменить
                  </Button>
                  <Button size="sm" variant="destructive" className="flex-1" onClick={() => openDelete(member)}>
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
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingMember ? 'Редактировать сотрудника' : 'Добавить сотрудника'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Photo upload with circle preview */}
            <div>
              <Label>Фото (отображается в кружке) *</Label>
              <div className="mt-2 flex items-start gap-4">
                {/* Circle preview */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="preview"
                        className={`w-full h-full object-cover ${form.imagePosition}`}
                      />
                    ) : (
                      <Users className="w-8 h-8 text-gray-300" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 text-center mt-1">Предпросмотр</p>
                </div>

                <div className="flex-1 space-y-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-300 hover:border-red-400 rounded-lg py-4 flex flex-col items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Upload className="w-6 h-6" />
                    <span className="text-sm">{imagePreview ? 'Сменить фото' : 'Загрузить фото'}</span>
                    <span className="text-xs text-gray-400">JPG, PNG до 5 МБ</span>
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={() => { setImagePreview(''); setForm((f) => ({ ...f, image: '' })); }}
                      className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700"
                    >
                      <X className="w-3.5 h-3.5" /> Убрать фото
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Position of photo in circle */}
            <div>
              <Label>Позиция фото в кружке</Label>
              <Select value={form.imagePosition} onValueChange={(v) => setForm((f) => ({ ...f, imagePosition: v }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {IMAGE_POSITIONS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Имя и фамилия *</Label>
              <Input
                className="mt-1"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Алишер Каноатзода"
              />
            </div>

            <div>
              <Label>Должность *</Label>
              <Input
                className="mt-1"
                value={form.position}
                onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))}
                placeholder="Руководитель отдела логистики"
              />
            </div>

            <div>
              <Label>Опыт *</Label>
              <Input
                className="mt-1"
                value={form.experience}
                onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))}
                placeholder="5+ лет в логистике"
              />
            </div>

            <div>
              <Label>Описание *</Label>
              <Textarea
                className="mt-1"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Краткое описание компетенций сотрудника..."
                rows={3}
              />
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
                {isPending ? 'Сохранение...' : editingMember ? 'Сохранить' : 'Добавить'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить сотрудника</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            Вы уверены, что хотите удалить сотрудника <strong>{deletingMember?.name}</strong>? Это действие необратимо.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Отмена</Button>
            <Button
              variant="destructive"
              onClick={() => deletingMember && deleteMutation.mutate(deletingMember.id)}
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
