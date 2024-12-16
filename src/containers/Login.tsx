import React, { useEffect, useState } from 'react';
import { getUsers, UserRequest } from '../services/User';
import { useUser } from '../context/UserContext'; // Импортируем хук для глобального состояния

type LoginProps = {
  onLogin: () => void;
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { setCurrentUser } = useUser(); // Получаем функцию для обновления глобального состояния
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usersData, setUsersData] = useState<UserRequest[]>([]); // Сохраняем список пользователей

  // Обновление локального состояния
  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getUsers();
      setUsersData(users); // Сохраняем данные пользователей
    };
    fetchUsers();
  }, []);

  const handleLogin = () => {
    // Находим пользователя с введённым логином и паролем
    const user = usersData.find(
      (u) => u.login === username && u.password === password
    );

    console.log(usersData);
    console.log(username);
    console.log(password);
    console.log(user);

    if (user) {
      // Сохраняем ID пользователя в глобальное состояние
      setCurrentUser(user.name); // Или другой уникальный идентификатор, например user.ID
      onLogin(); // Вызываем функцию успешного входа
    } else {
      alert('Неверный логин или пароль');
    }
  };

  return (
    <div className="card mx-auto mt-4" style={{ maxWidth: '400px' }}>
      <div className="card-body">
        <h2 className="card-title text-center">Авторизация</h2>
        <form>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Логин
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}  
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Пароль
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="btn btn-primary w-100"
            onClick={handleLogin}
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
