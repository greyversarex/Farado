import { useState, useEffect } from 'react';
import { Route, Switch } from 'wouter';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import CounterpartyDetails from './admin/CounterpartyDetails';
import WarehouseDetails from './admin/WarehouseDetails';

export default function AdminApp() {
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Проверка сохраненной авторизации при загрузке
  useEffect(() => {
    const checkSavedAuth = async () => {
      const savedUser = localStorage.getItem('adminUser');
      const savedCredentials = localStorage.getItem('adminCredentials');
      
      if (savedUser && savedCredentials) {
        try {
          const userData = JSON.parse(savedUser);
          const credentials = JSON.parse(savedCredentials);
          
          // Проверяем валидность сохраненных данных через тестовый запрос
          const response = await fetch('/api/admin/orders', {
            headers: {
              username: credentials.username,
              password: credentials.password
            }
          });
          
          if (response.ok) {
            setUser(userData);
          } else {
            // Если данные недействительны, очищаем их
            localStorage.removeItem('adminUser');
            localStorage.removeItem('adminCredentials');
          }
        } catch (error) {
          console.error('Error checking saved auth:', error);
          localStorage.removeItem('adminUser');
          localStorage.removeItem('adminCredentials');
        }
      }
      setIsCheckingAuth(false);
    };

    checkSavedAuth();
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    // Сохраняем данные пользователя в localStorage
    localStorage.setItem('adminUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    // Очищаем сохраненные данные при выходе
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminCredentials');
  };

  // Показываем загрузку пока проверяем авторизацию
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <Switch>
      <Route path="/counterparty/:id">
        <CounterpartyDetails />
      </Route>
      <Route path="/warehouse/:id">
        <WarehouseDetails />
      </Route>
      <Route>
        <AdminDashboard user={user} onLogout={handleLogout} />
      </Route>
    </Switch>
  );
}