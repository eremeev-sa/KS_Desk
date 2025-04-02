import React, { useEffect, useState } from 'react';
import Tasks from './Tasks'; // Компонент для отображения задач
import { ColumnRequest } from '../../services/Column'; // Интерфейсы и функции для работы с колонками
import { Draggable } from 'react-beautiful-dnd'; // Библиотека для Drag-and-Drop
import styled from 'styled-components'; // Для стилизации компонентов
import { colors } from '@atlaskit/theme'; // Цветовые палитры
import { TaskUpdateRequest } from '../../services/Task'; // Интерфейсы и функции для работы с задачами
import {
    Box,
    Text,
    TextInput,
    Button,
    ActionIcon,
    Card,
    Group,
    Flex
} from '@mantine/core';
import { IconGripVertical, IconTrash, IconCheck, IconX } from '@tabler/icons-react';

const Container = styled.div`
  margin: 0px;
  display: flex;
  flex-direction: column;
`;

type ColumnProps = {
    id: string; // Идентификатор колонки
    name: string; // Название колонки
    index: number; // Порядковый номер колонки
    tasks: { // Список задач
        id: string;
        name: string;
        description: string;
        priority: string;
        columnId: string;
        assignedId: string;
    }[];

    handleTaskUpdate: (id: string, taskRequest: TaskUpdateRequest) => void; // Обновление задачи
    handleTaskLocalUpdate: () => void; // Локальное обновление задач
    onDelete: (id: string) => void; // Удаление колонки
    onUpdate: (id: string, columnRequest: ColumnRequest) => void; // Обновление колонки
};

const Column: React.FC<ColumnProps> = ({ id, name, index, onDelete, onUpdate, tasks, handleTaskUpdate, handleTaskLocalUpdate }) => {
    const [isEditing, setIsEditing] = useState(false); // Флаг режима редактирования
    const [tempName, setTempName] = useState(name); // Временное имя для редактирования
    const [columnTasks, setColumnTasks] = useState(tasks.filter(task => task.columnId === id));

    useEffect(() => {
        console.log("Changes changed!");
        setColumnTasks(tasks.filter(task => task.columnId === id));
    }, [tasks])
    // Обработка клика для перехода в режим редактирования
    const handleEditClick = () => {
        setIsEditing(true);
    };

    // Сохранение изменений названия колонки
    const handleSaveClick = () => {
        const columnRequest = { id: id, name: tempName };
        onUpdate(id, columnRequest);
        setIsEditing(false); // Выход из режима редактирования
    };

    // Отмена изменений названия колонки
    const handleCancelClick = () => {
        setTempName(name); // Сбрасываем временное имя
        setIsEditing(false); // Выход из режима редактирования
    };

    return (
        <Draggable draggableId={id} index={index} key={id}>
            {(provided, snapshot) => (
                <Box
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={{
                        ...provided.draggableProps.style,
                        minWidth: 330,
                        maxWidth: 330,
                        flexShrink: 0
                    }}
                >
                    <Card
                        withBorder
                        shadow="sm"
                        radius="md"
                        p="sm"
                        style={{
                            backgroundColor: snapshot.isDragging ? 'var(--mantine-color-gray-2)' : undefined
                        }}
                    >
                        {/* Заголовок колонки */}
                        <Card.Section p="xs" withBorder>
                            {isEditing ? (
                                <Group>
                                    <TextInput
                                        value={tempName}
                                        onChange={(e) => setTempName(e.currentTarget.value)}
                                        style={{ flex: 1 }}
                                        size="sm"
                                        autoFocus
                                    />
                                    <ActionIcon
                                        color="green"
                                        variant="light"
                                        onClick={handleSaveClick}
                                    >
                                        <IconCheck size={16} />
                                    </ActionIcon>
                                    <ActionIcon
                                        color="red"
                                        variant="light"
                                        onClick={handleCancelClick}
                                    >
                                        <IconX size={16} />
                                    </ActionIcon>
                                </Group>
                            ) : (
                                <Group justify="space-between">
                                    <Group gap="xs">
                                        <Box
                                            {...provided.dragHandleProps}
                                            style={{ cursor: 'grab' }}
                                        >
                                            <IconGripVertical size={18} />
                                        </Box>
                                        <Text
                                            fw={600}
                                            onDoubleClick={handleEditClick}
                                            style={{ cursor: 'text' }}
                                        >
                                            {name}
                                        </Text>
                                    </Group>
                                    <ActionIcon
                                        variant="subtle"
                                        color="red"
                                        onClick={() => onDelete(id)}
                                    >
                                        <IconTrash size={16} />
                                    </ActionIcon>
                                </Group>
                            )}
                        </Card.Section>

                        {/* Список задач */}
                        <Box pt="sm">
                            <Tasks
                                tasks={columnTasks}
                                handleTaskUpdate={handleTaskUpdate}
                                handleTaskLocalUpdate={handleTaskLocalUpdate}
                                columnId={id}
                            />
                        </Box>
                    </Card>
                </Box>
            )}
        </Draggable>
    );
};


export default Column;
