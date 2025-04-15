import React, { useEffect, useState } from 'react';
import {
    Box,
    Text,
    TextInput,
    Textarea,
    Select,
    Button,
    ActionIcon,
    Group,
    Divider,
    Card,
    Badge,
    Collapse,
    useMantineTheme
} from '@mantine/core';
import { IconGripVertical, IconEdit, IconTrash, IconCheck, IconX } from '@tabler/icons-react';
import { Draggable } from 'react-beautiful-dnd';
import Subtasks from './Subtasks';
import { TaskUpdateRequest } from '../../services/Task';
import { SubtaskType, TaskType } from '../../models/models';
import { getSubtasks } from '../../services/Subtask';
import { useForm } from '@mantine/form';

type TaskProps = {
    task: TaskType;
    index: number;
    onDelete: (id: string) => void;
    handleTaskUpdate: (id: string, taskRequest: TaskUpdateRequest) => void;
    usersData: {
        id: string;
        name: string;
        login: string;
        password: string;
    }[];
};

const Task: React.FC<TaskProps> = ({ task, index, onDelete, handleTaskUpdate, usersData }) => {
    const theme = useMantineTheme();
    const [isEditing, setIsEditing] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [subtaskData, setSubtaskData] = useState<SubtaskType[]>([]);

    const priorityTranslate: Record<number, string> = { // Для вывода значения в задаче
        0: 'Не назначен',
        1: 'Наивысший',
        2: 'Высокий',
        3: 'Средний',
        4: 'Низкий',
        5: 'Наименьший',
    };

    const revesePriorityTranslate: Record<string, number> = { // Для отправки запроса в бд
        'Не назначен': 0,
        'Наивысший': 1,
        'Высокий': 2,
        'Средний': 3,
        'Низкий': 4,
        'Наименьший': 5,
    };

    const priorityOptions = [ // Для окна выбора приоритета при редактировании задачи
        { value: 'Наименьший', label: 'Наименьший' },
        { value: 'Низкий', label: 'Низкий' },
        { value: 'Средний', label: 'Средний' },
        { value: 'Высокий', label: 'Высокий' },
        { value: 'Наивысший', label: 'Наивысший' },
        { value: 'Не назначен', label: 'Не назначен' },
    ];

    const getPriorityColor = (priority: number) => { // Для вывода цвета приоритета
        switch (priority) {
            case 1: return '#e03131';
            case 2: return '#e8590c';
            case 3: return 'yellow';
            case 4: return 'green';
            case 5: return "#82c91e";
            default: return 'gray';
        }
    };


    const form = useForm({
        initialValues: {
            taskName: task.name,
            taskDescription: task.description,
            taskPriority: priorityTranslate[task.priority],
            taskUser: task.assignedId,
        },
        validate: {
            taskName: (value: string) => (
                value.trim() ? null : 'Введите название задачи!'
            )
        }
    });

    useEffect(() => {
        const fetchSubtasks = async () => {
            const subtasks = await getSubtasks(task.id);
            setSubtaskData(subtasks);
        };
        fetchSubtasks();
    }, [task.id]);

    const userOptions = usersData.map((user) => ({
        value: user.id,
        label: user.name,
    }));

    const handleEditClick = () => {
        setIsEditing(true);
        setIsExpanded(true);
    };

    const handleSaveClick = async () => {
        try {
            form.validate()
            if (!form.isValid()) {
                return;
            }
            const taskRequest = {
                name: form.values.taskName,
                description: form.values.taskDescription,
                priority: revesePriorityTranslate[form.values.taskPriority],
                endDate: new Date("2025-04-14T09:54:19.742Z"),
                assignedId: form.values.taskUser === null || "" ? null : form.values.taskUser
            };
            handleTaskUpdate(task.id, taskRequest);
            setIsEditing(false);
        }
        catch (error) {
            console.error("Ошибка при редактировании задачи:", error);
        }
    };

    const handleCancelClick = () => {
        form.reset();
        setIsEditing(false);
    };

    const handleKeyPress = (event: any) => {
        if (event.key === 'Enter') {
            handleSaveClick();
        }
    }

    return (
        <Draggable draggableId={task.id} index={index} key={task.id}>
            {(provided, snapshot) => (
                <Box
                    maw={"280"}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={{
                        ...provided.draggableProps.style,
                        marginBottom: theme.spacing.xs
                    }}
                >
                    <Card
                        withBorder
                        shadow="sm"
                        radius="md"
                        style={{
                            backgroundColor: snapshot.isDragging ? theme.colors.gray[1] : undefined
                        }}
                    >
                        <Group align="flex-start" wrap='nowrap'>
                            <Box {...provided.dragHandleProps} style={{ cursor: 'grab' }}>
                                <IconGripVertical size={16} />
                            </Box>

                            <Box mb={'10px'} style={{ flex: 1 }} onClick={() => !isEditing && setIsExpanded(!isExpanded)}>
                                {isEditing ? (
                                    <>
                                        <TextInput
                                            {...form.getInputProps('taskName')}
                                            label="Название задачи"
                                            mb="xs"
                                            autoFocus
                                            onKeyDown={handleKeyPress}
                                        />
                                        <Select
                                            label="Приоритет"
                                            data={priorityOptions}
                                            {...form.getInputProps('taskPriority')}
                                            mb="xs"
                                            defaultValue={priorityTranslate[task.priority]}
                                        />
                                        <Select
                                            label="Исполнитель"
                                            data={userOptions}
                                            {...form.getInputProps('taskUser')}
                                            searchable
                                            mb="xs"
                                            clearable
                                        />
                                    </>
                                ) : (
                                    <>
                                        <Group align="start" wrap="nowrap">
                                            <Text fw={500}
                                                maw={150}
                                                style={{
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    display: 'block'
                                                }}
                                            >
                                                {task.name}
                                            </Text>
                                            <Group align="end" left={'auto'} right={20} pos={'absolute'} wrap="nowrap" gap={5}>
                                                <ActionIcon variant="subtle" type='button' onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleEditClick();
                                                }}>
                                                    <IconEdit type='button' size={16} />
                                                </ActionIcon>
                                                <ActionIcon color="red" variant="subtle" type='button' onClick={() => onDelete(task.id)}>
                                                    <IconTrash size={16} />
                                                </ActionIcon>
                                            </Group>
                                        </Group>
                                        <Badge
                                            maw={130}
                                            style={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                display: 'block'
                                            }}
                                            color={getPriorityColor(task.priority)}
                                            variant="light"
                                            mt={4}
                                        >
                                            {priorityTranslate[task.priority]}
                                        </Badge>
                                        <Text size="sm" c="dimmed" mt={4}
                                            maw={130}
                                        >
                                            {usersData.find(u => task.assignedId != null && String(u.id) === String(task.assignedId))?.name || "Не назначен"}
                                        </Text>
                                    </>
                                )}
                            </Box>


                            <Group align="start" wrap="nowrap" gap={5}>
                                {isEditing ? (
                                    <Group mt={5} gap={5}>
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
                                    <>
                                    </>
                                )}
                            </Group>
                        </Group>

                        <Collapse in={isExpanded || isEditing}>
                            <Divider></Divider>
                            <Box mt="xs">
                                {isEditing ? (
                                    <Textarea
                                        label="Описание"
                                        {...form.getInputProps('taskDescription')}
                                        autosize
                                        minRows={2}
                                        maxRows={4}
                                        resize='vertical'
                                    />
                                ) : (
                                    <Text size="sm" fs={"oblique"}
                                        style={{
                                            whiteSpace: 'pre-line',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: 'block'
                                        }}
                                    >
                                        {task.description}
                                    </Text>
                                )}
                                <Subtasks data={subtaskData} taskId={task.id} />
                            </Box>
                        </Collapse>
                    </Card>
                </Box>
            )
            }
        </Draggable >
    );
};

export default Task;