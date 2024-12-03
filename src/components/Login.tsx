import React, { useState } from 'react';

type LoginProps = {
  onLogin: () => void;
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username === 'admin' && password === 'admin') {
      onLogin();
    } else {
      alert('Invalid credentials');
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
          <button type="button" className="btn btn-primary w-100" onClick={handleLogin}>
            Войти
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
