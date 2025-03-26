import React, { useEffect, useState } from 'react';
import Task from './Task';
import { Droppable } from 'react-beautiful-dnd';
import { createTask, deleteTask, TaskUpdateRequest } from '../../services/Task';
import { TaskType, UserType } from '../../models/models';
import { getUsers } from '../../services/User';
import {
    Box,
    Text,
    TextInput,
    Button,
    ActionIcon,
    Group,
    Stack,
    Card
} from '@mantine/core';
import { IconPlus, IconCheck, IconX } from '@tabler/icons-react';

type TasksProps = {
    tasks: {
        id: string;
        name: string;
        description: string;
        priority: string;
        columnId: string;
        assigneeId: string;
    }[];
    columnId: string;

    handleTaskUpdate: (id: string, taskRequest: TaskUpdateRequest) => void;
    handleTaskLocalUpdate: () => void;
};

const Tasks: React.FC<TasksProps> = ({ tasks, columnId, handleTaskUpdate, handleTaskLocalUpdate }) => {
    const [addNewTask, setAddNewTask] = useState(false); // Флаг для отображения формы добавления задачи
    const [tempTaskName, setTempTaskName] = useState(''); // Временное название задачи
    const [localTasks, setLocalTasks] = useState<TaskType[]>(tasks); // Локальное состояние задач
    const [usersData, setUsersData] = useState<UserType[]>([]); // Данные о пользователях для назначений задач

    // Обновление локального состояния задач при изменении props.tasks
    useEffect(() => {
        setLocalTasks(tasks);
    }, [tasks]); // Обновляется каждый раз, когда tasks изменяется

    // Получение данных пользователей из API
    useEffect(() => {
        const fetchColumns = async () => {
            const users = await getUsers();
            setUsersData(users);
        }
        fetchColumns();
    }, []);

    // Добавление новой задачи
    const handleAddClick = async () => {
        try {
            const newTask = {
                name: tempTaskName,
                description: "",
                priority: "",
                columnId: columnId,
            };
            await createTask(newTask); // Отправляем запрос на создание задачи
            handleTaskLocalUpdate(); // Уведомляем родительский компонент об обновлении задач
            setTempTaskName(''); // Очищаем поле ввода
            setAddNewTask(false); // Скрываем форму добавления
        } catch (error) {
            console.error("Ошибка при добавлении задачи:", error);
        }
    };

    // Удаление задачи
    const handleDelete = async (id: string) => {
        try {
            await deleteTask(id);
            handleTaskLocalUpdate(); // Уведомляем родительский компонент об обновлении задач
        } catch (error) {
            console.error("Ошибка при удалении задачи:", error);
        }
    };

    // Отмена добавления задачи
    const handleCancelClick = () => {
        setTempTaskName(""); // Очищаем временное название
        setAddNewTask(false); // Скрываем форму добавления
    };

    return (
        <Box p="xs">
            {/* Область для перетаскивания задач */}
            <Droppable
                droppableId={columnId}
                type="TASK"
                direction="vertical"
                isCombineEnabled={false}
            >
                {(provided) => (
                    <Stack
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        gap="xs"
                        style={{ minHeight: 100 }}
                    >
                        {localTasks.length === 0 ? (
                            <Text ta="center" py="md">
                                Задач нет
                            </Text>
                        ) : (
                            localTasks.map((task, index) => (
                                <Task
                                    key={task.id}
                                    {...task}
                                    index={index}
                                    task={task}
                                    onDelete={handleDelete}
                                    handleTaskUpdate={handleTaskUpdate}
                                    usersData={usersData}
                                />
                            ))
                        )}
                        {provided.placeholder}
                    </Stack>
                )}
            </Droppable>

            {/* Форма добавления новой задачи */}
            {addNewTask ? (
                <Box mt="sm">
                    <TextInput
                        placeholder="Название задачи"
                        value={tempTaskName}
                        onChange={(e) => setTempTaskName(e.currentTarget.value)}
                        mb="xs"
                        autoFocus
                    />
                    <Group>
                        <Button
                            variant="light"
                            color="green"
                            size="sm"
                            leftSection={<IconCheck size={16} />}
                            onClick={handleAddClick}
                        >
                            Добавить
                        </Button>
                        <Button
                            variant="light"
                            color="red"
                            size="sm"
                            leftSection={<IconX size={16} />}
                            onClick={handleCancelClick}
                        >
                            Отмена
                        </Button>
                    </Group>
                </Box>
            ) : (
                <Button
                    fullWidth
                    variant="light"
                    color="gray"
                    mt="sm"
                    leftSection={<IconPlus size={16} />}
                    onClick={() => setAddNewTask(true)}
                >
                    Добавить задачу
                </Button>
            )}
        </Box>
    );
};


export default Tasks;
