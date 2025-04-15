import React, { useEffect, useState } from 'react';
import Sidebar from '../components/menu/Sidebar';
import Columns from '../components/main/Columns';
import '../styles/custom.css';
import { useUser } from '../context/UserContext'; // Используем хук для работы с глобальным состоянием пользователя
import { Text, ScrollArea, Loader, Group, Box, Divider } from '@mantine/core';
import classes from '../styles/KanbanWindow.module.css';

type KanbanWindowProps = {
    onLogout: () => void; // Функция для выхода из системы
};

const KanbanWindow: React.FC<KanbanWindowProps> = ({ onLogout }) => {
    const { currentUser } = useUser(); // Получаем текущего пользователя из глобального состояния
    const [currentBoardId, setCurrentBoardId] = useState<string>(""); // ID текущей доски

    return (
        <Group className={classes.container}>
            <Sidebar
                currentBoardId={currentBoardId}
                userName={currentUser?.name}
                onLogout={onLogout}
                onBoardClick={(id) => setCurrentBoardId(id)}
            />

            <Columns currentBoardId={currentBoardId} />
        </Group>
    );
};

export default KanbanWindow;
