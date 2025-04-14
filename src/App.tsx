import React, { useState } from 'react';
import Login from './containers/Login'; // Компонент для отображения страницы входа
import 'bootstrap/dist/css/bootstrap.min.css'; // Подключение стилей Bootstrap для оформления
import KanbanWindow from './containers/KanbanWindow'; // Основной компонент для отображения интерфейса Канбан-доски
import { UserProvider } from './context/UserContext'; // Провайдер контекста пользователя для управления состоянием пользователя на уровне приложения
import { Group, Box } from '@mantine/core';

// Mantine import
import '@mantine/core/styles.css';
import { createTheme, MantineProvider } from '@mantine/core';

const theme = createTheme({
  /** Put your mantine theme override here */
});

function App() {
  // Хранит состояние, авторизован ли пользователь
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Хранит имя текущего пользователя
  const [currentUser, setCurrentUser] = useState("");

  return (
    <MantineProvider>
      {/* UserProvider предоставляет доступ к контексту пользователя всем вложенным компонентам*/}
      <UserProvider>
        <Group>
          {/* Если пользователь не авторизован, отображается компонент Login */}
          {!isAuthenticated ? (
            <Login onLogin={() => setIsAuthenticated(true)} shadow="sm" maw={400} mx="auto" my="5vh"/> // Передаем функцию для обновления состояния авторизации
          ) : (
            // Если пользователь авторизован, отображается компонент KanbanWindow
            <KanbanWindow onLogout={() => setIsAuthenticated(false)} /> // Передаем функцию для выхода из системы
          )}
        </Group>
      </UserProvider>
    </MantineProvider>
  );
}

export default App;
