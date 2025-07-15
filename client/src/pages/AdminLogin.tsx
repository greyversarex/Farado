import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface AdminLoginProps {
  onLogin: (user: any) => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await apiRequest('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
      const data = await response.json();
      
      // Сохраняем учетные данные для проверки сессии
      localStorage.setItem('adminCredentials', JSON.stringify({ 
        username: credentials.username, 
        password: credentials.password 
      }));
      
      // Добавляем пароль в объект пользователя для последующего использования
      const userWithPassword = {
        ...data.user,
        password: credentials.password
      };
      
      onLogin(userWithPassword);
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.message.includes('401')) {
        setError('Неверные учетные данные');
      } else {
        setError('Ошибка подключения');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <CardTitle className="text-xl sm:text-2xl">FARADO TEAM</CardTitle>
          <p className="text-sm sm:text-base text-gray-600">Система управления заказами</p>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <Label htmlFor="username" className="text-sm sm:text-base">Логин</Label>
              <Input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                placeholder="Введите логин"
                className="h-10 sm:h-12 text-sm sm:text-base mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-sm sm:text-base">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                placeholder="Введите пароль"
                className="h-10 sm:h-12 text-sm sm:text-base mt-1"
                required
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm text-center p-2 bg-red-50 rounded-lg">{error}</div>
            )}
            <Button type="submit" className="w-full h-10 sm:h-12 text-sm sm:text-base font-semibold" disabled={isLoading}>
              {isLoading ? 'Вход...' : 'Войти в систему'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}