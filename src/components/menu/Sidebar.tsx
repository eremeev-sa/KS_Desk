import React, { useState, useEffect } from "react";
import BoardList from "./BoardList";
import UserInfo from "./UserInfo";
import { getBoards, updateBoard, BoardRequest, deleteBoard } from "../../services/Board";
import "@fontsource/ibm-plex-sans";
import { Text, ScrollArea, Loader, Group, Box, Divider } from '@mantine/core';
import { IconLayoutKanban } from '@tabler/icons-react';
import { IconMoon, IconSun } from '@tabler/icons-react';
import cx from 'clsx';
import { ActionIcon, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import classes from '../../styles/ActionToggle.module.css'
import classesSidebar from '../../styles/Sidebar.module.css';

type SidebarProps = {
  userName: string; // Имя текущего пользователя
  onLogout: () => void; // Функция для выхода из системы
  onBoardClick: (id: string) => void; // Обработчик клика на доску
  currentBoardId: string; // ID текущей выбранной доски
};

const Sidebar: React.FC<SidebarProps> = ({ userName, onLogout, onBoardClick, currentBoardId }) => {
  const [data, setData] = useState<{ id: string; name: string }[]>([]); // Список досок
  const [dataGettingLoading, setDataGettingLoading] = useState(true); // Состояние загрузки
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  // Загрузка данных о досках при монтировании компонента
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const boards = await getBoards(); // Получение списка досок с сервера
        setData(boards); // Обновление состояния с досками
        setDataGettingLoading(false); // Завершение загрузки
      } catch (error) {
        console.error("Ошибка при загрузке досок:", error);
      }
    };

    fetchBoards();
  }, []);

  // Обработчик обновления доски
  const handleUpdate = async (id: string, boardRequest: BoardRequest) => {
    try {
      await updateBoard(id, boardRequest); // Отправка обновленных данных доски на сервер
      const updatedBoards = await getBoards(); // Получение обновленного списка досок
      setData(updatedBoards); // Обновление данных в состоянии
    } catch (error) {
      console.error("Ошибка при обновлении доски:", error);
    }
  };

  // Обработчик удаления доски
  const handleDelete = async (id: string) => {
    try {
      await deleteBoard(id); // Удаление доски на сервере
      const updatedBoards = await getBoards(); // Получение обновленного списка досок
      setData(updatedBoards); // Обновление данных в состоянии
      onBoardClick(""); // Сброс текущей выбранной доски
    } catch (error) {
      console.error("Ошибка при удалении доски:", error);
    }
  };

  return (
    <Box
      className={classesSidebar.sidebar}
      bg={colorScheme === 'dark' ? 'dark.7' : 'gray.1'}
    >
      {/* Заголовок боковой панели */}
      <Group className={classesSidebar.header} justify="space-between">
        <Group gap="sm" align="center">
          <Box className={(colorScheme === 'light' ? classesSidebar.sidebarHeaderIcoLight : classesSidebar.sidebarHeaderIcoDark)} />
          <Text fw={700} size="xl">КС Деск</Text>
        </Group>

        <ActionIcon
          onClick={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')}
          variant="default"
          size="xl"
          aria-label="Toggle color scheme"
        >
          {colorScheme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
        </ActionIcon>
      </Group>

      {/* Список досок */}
      <Box className={classes.content}>
        <BoardList
          currentBoardId={currentBoardId}
          data={data}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onBoardClick={onBoardClick}
          dataGettingLoading={dataGettingLoading}
        />
      </Box>

      {/* Информация о пользователе */}
      <Box className={classes.footer}>
        <UserInfo userName={userName} onLogout={onLogout} />
      </Box>
    </Box>
  );
};

export default Sidebar;
