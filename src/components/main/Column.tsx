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
    Flex,
    Loader
} from '@mantine/core';
import { IconGripVertical, IconTrash, IconCheck, IconX } from '@tabler/icons-react';
import { useForm, UseFormReturnType } from '@mantine/form';
import { ColumnType, TaskType } from '../../models/models';

type ColumnProps = {
    column: ColumnType;
    index: number; // Порядковый номер колонки
    tasks: TaskType[];
    tasksLoading: Boolean;

    handleTaskUpdate: (id: string, taskRequest: TaskUpdateRequest) => void; // Обновление задачи
    handleTaskLocalUpdate: () => void; // Локальное обновление задач
    onDelete: (id: string) => void; // Удаление колонки
    onUpdate: (id: string, columnRequest: ColumnRequest) => void; // Обновление колонки
    columnNameValidate: (id: string, name: string) => Boolean;
};

const Column: React.FC<ColumnProps> = ({ column, index, onDelete, onUpdate, tasks, tasksLoading, handleTaskUpdate, handleTaskLocalUpdate, columnNameValidate }) => {
    const [isEditing, setIsEditing] = useState(false); // Флаг режима редактирования
    const [columnTasks, setColumnTasks] = useState(tasks.filter(task => task.columnId === column.id));

    const form = useForm({
        initialValues: {
            columnName: column.name,
        },
        validate: {
            columnName: (value: string) => (
                value.trim()
                    ? (columnNameValidate(column.id, value)
                        ? null
                        : "Доска с таким названием уже существует!")
                    : "Введите название доски"),
        }
    });

    useEffect(() => {
        setColumnTasks(tasks.filter(task => task.columnId === column.id));
    }, [tasks])
    // Обработка клика для перехода в режим редактирования
    const handleEditClick = () => {
        setIsEditing(true);
    };

    // Сохранение изменений названия колонки
    const handleSaveClick = () => {
        form.validate()
        if (!form.isValid()) {
            return;
        }
        if (column.name != form.values.columnName) {
            const columnRequest = { id: column.id, name: form.values.columnName };
            onUpdate(column.id, columnRequest);
        }
        setIsEditing(false); // Выход из режима редактирования
    };

    // Отмена изменений названия колонки
    const handleCancelClick = () => {
        form.reset();
        setIsEditing(false); // Выход из режима редактирования
    };

    const handleKeyPress = (event: any) => {
        if (event.key === 'Enter') {
            handleSaveClick();
        }
    }

    return (
        <Draggable draggableId={column.id} index={index} key={column.id}>
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
                                    <Group align="start" wrap="nowrap" gap={5} miw={"100%"}>
                                        <TextInput
                                            placeholder='Название колонки'
                                            {...form.getInputProps('columnName')}
                                            style={{ flex: 1 }}
                                            size="sm"
                                            w={250}
                                            onKeyDown={handleKeyPress}
                                            autoFocus
                                        />
                                        <Group mt={5} wrap="nowrap" gap={5}>
                                            <ActionIcon
                                                onClick={handleSaveClick}
                                                color="green"
                                                variant="light"
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
                                    </Group>
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
                                            {column.name}
                                        </Text>
                                    </Group>
                                    <ActionIcon
                                        variant="subtle"
                                        color="red"
                                        onClick={() => onDelete(column.id)}
                                    >
                                        <IconTrash size={16} />
                                    </ActionIcon>
                                </Group>
                            )}
                        </Card.Section>

                        {/* Список задач */}
                        <Box pt="sm">
                            {tasksLoading ? (
                                <Group m="xl" justify="center">
                                    <Loader size="sm" />
                                    <Text>Загрузка...</Text>
                                </Group>
                            ) :
                                (
                                    <Tasks
                                        tasks={columnTasks}
                                        handleTaskUpdate={handleTaskUpdate}
                                        handleTaskLocalUpdate={handleTaskLocalUpdate}
                                        columnId={column.id}
                                    />
                                )
                            }
                        </Box>
                    </Card>
                </Box>
            )}
        </Draggable>
    );
};


export default Column;
