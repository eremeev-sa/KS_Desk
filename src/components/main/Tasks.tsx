import React, { useEffect, useState } from 'react';
import Task from './Task';
import { Droppable } from 'react-beautiful-dnd';
import { createTask, deleteTask, TaskUpdateRequest } from '../../services/Task';
import { TaskType, UserType } from '../../models/models';
import { getUsers, UserRequest } from '../../services/User';
import {
    Box,
    Text,
    TextInput,
    Button,
    ActionIcon,
    Group,
    Stack,
    Card,
    ScrollArea
} from '@mantine/core';
import { IconPlus, IconCheck, IconX } from '@tabler/icons-react';
import classesKanbanTasks from '../../styles/KanbanTasks.module.css';
import { useForm } from '@mantine/form';
import { useUser } from '../../context/UserContext';

type TasksProps = {
    tasks: TaskType[];
    columnId: string;

    handleTaskUpdate: (id: string, taskRequest: TaskUpdateRequest) => void;
    handleTaskLocalUpdate: () => void;
};

const Tasks: React.FC<TasksProps> = ({ tasks, columnId, handleTaskUpdate, handleTaskLocalUpdate }) => {
    const [addNewTask, setAddNewTask] = useState(false); // Флаг для отображения формы добавления задачи
    const [tempTaskName, setTempTaskName] = useState(''); // Временное название задачи
    const [localTasks, setLocalTasks] = useState<TaskType[]>(tasks); // Локальное состояние задач
    const [usersData, setUsersData] = useState<UserType[]>([]); // Данные о пользователях для назначений задач
    const { currentUser } = useUser(); // Получаем текущего пользователя из глобального состояния
    const [user] = useState(currentUser); // Устанавливаем имя пользователя

    const form = useForm({
        initialValues: {
            taskName: '',
        },
        validate: {
            taskName: (value: string) => (
                value.trim() ? null : 'Введите название задачи!'
            )
        }
    });

    // Обновление локального состояния задач при изменении props.tasks
    useEffect(() => {
        setLocalTasks(tasks);
    }, [tasks]); // Обновляется каждый раз, когда tasks изменяется

    // Получение данных пользователей из API
    useEffect(() => {
        const fetchColumns = async () => {
            const users: UserRequest[] = [
                    {id: 'd848d900-a1db-4b86-a79d-c81ed6581e23', name: 'Alex', login: 'Merser', password: '12345', role: 'user'}, 
                    {id: 'e726830a-3814-4762-b44a-adf033018baa', name: 'Ivan', login: 'Ivanov', password: '12345', role: 'user'},
                    {id: '5a9ae92c-c463-4f97-a4eb-e35c5249db81', name: 'Иванов Иван Иванович', login: 'string', password: 'string', role: 'user'},
                  ] // await getUsers();
            setUsersData(users);
        }
        fetchColumns();
    }, []);

    // Добавление новой задачи
    const handleAddClick = async () => {
        try {
            form.validate()
            if (!form.isValid()) {
                return;
            }
            const newTask = {   
                name: form.values.taskName,
                description: "",
                priority: 0,
                endDate: new Date("2025-04-14T09:54:19.742Z"),
                columnId: columnId,
                assignedId: null,
            };
            form.reset(); // Очищаем поле ввода
            setAddNewTask(false); // Скрываем форму добавления
            await createTask(newTask); // Отправляем запрос на создание задачи
            handleTaskLocalUpdate(); // Уведомляем родительский компонент об обновлении задач
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
        form.reset(); // Очищаем временное название
        setAddNewTask(false); // Скрываем форму добавления
    };

    const handleKeyPress = (event: any) => {
        if (event.key === 'Enter') {
            handleAddClick();
        }
    }

    return (
        <ScrollArea.Autosize style={{ overflowX: 'hidden' }} mah={"90vh"}>
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
                                localTasks.sort((a, b) => a.order - b.order).map((task, index) => (
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
                            )
                            }
                            {provided.placeholder}
                        </Stack>
                    )}
                </Droppable>

                {/* Форма добавления новой задачи */}
                {addNewTask ? (
                    <Box mt="sm">
                        <TextInput
                            placeholder="Название задачи"
                            {...form.getInputProps('taskName')}
                            mb="xs"
                            onKeyDown={handleKeyPress}
                            autoFocus
                        />
                        <Group>
                            <Button
                                onClick={handleAddClick}
                                variant="light"
                                color="green"
                                size="sm"
                                leftSection={<IconCheck size={16} />}
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
                        w={280}
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
        </ScrollArea.Autosize>
    );
};


export default Tasks;
