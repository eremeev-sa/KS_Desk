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
import { SubtaskType } from '../../models/models';
import { getSubtasks } from '../../services/Subtask';

type TaskProps = {
    task: {
        id: string;
        name: string;
        description: string;
        priority: string;
        columnId: string;
        assignedId: string;
    };
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
    const [tempName, setTempName] = useState(task.name);
    const [tempUser, setTempUser] = useState(task.assignedId || null);
    const [tempDescription, setTempDescription] = useState(task.description || "");
    const [tempPriority, setTempPriority] = useState(task.priority || "");
    const [subtaskData, setSubtaskData] = useState<SubtaskType[]>([]);

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

    const priorityOptions = [
        { value: 'Низкий', label: 'Низкий' },
        { value: 'Средний', label: 'Средний' },
        { value: 'Высокий', label: 'Высокий' },
    ];

    const handleEditClick = () => {
        setIsEditing(true);
        setIsExpanded(true);
    };

    const handleSaveClick = () => {
        const taskRequest = {
            name: tempName,
            description: tempDescription,
            priority: tempPriority,
            assignedId: tempUser
        };
        handleTaskUpdate(task.id, taskRequest);
        console.log(usersData);
        console.log(tempUser);
        setIsEditing(false);
    };

    const handleCancelClick = () => {
        setTempName(task.name);
        setTempDescription(task.description);
        setTempPriority(task.priority);
        setTempUser(task.assignedId);
        setIsEditing(false);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'Высокий': return 'red';
            case 'Средний': return 'yellow';
            case 'Низкий': return 'green';
            default: return 'gray';
        }
    };

    return (
        <Draggable draggableId={task.id} index={index} key={task.id}>
            {(provided, snapshot) => (
                <Box
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
                                            value={tempName}
                                            onChange={(e) => setTempName(e.currentTarget.value)}
                                            label="Название задачи"
                                            mb="xs"
                                        />
                                        <Select
                                            label="Приоритет"
                                            data={priorityOptions}
                                            value={tempPriority}
                                            onChange={(value) => setTempPriority(value || '')}
                                            mb="xs"
                                        />
                                        <Select
                                            label="Исполнитель"
                                            data={userOptions}
                                            value={tempUser} // Просто передаём значение ID (string)
                                            onChange={(value) => setTempUser(value || null)} // value уже будет string
                                            searchable
                                            mb="xs"
                                        />
                                    </>
                                ) : (
                                    <>
                                        <Text fw={500}>{task.name}</Text>
                                        <Badge
                                            color={getPriorityColor(task.priority)}
                                            variant="light"
                                            mt={4}
                                        >
                                            {task.priority}
                                        </Badge>
                                        <Text size="sm" c="dimmed" mt={4}>
                                            {usersData.find(u => String(u.id) === String(task.assignedId))?.name || "Не назначен"}
                                        </Text>
                                    </>
                                )}
                            </Box>

                            <Group gap={4}>
                                {isEditing ? (
                                    <>
                                        <ActionIcon color="green" onClick={handleSaveClick}>
                                            <IconCheck size={16} />
                                        </ActionIcon>
                                        <ActionIcon color="red" onClick={handleCancelClick}>
                                            <IconX size={16} />
                                        </ActionIcon>
                                    </>
                                ) : (
                                    <>
                                        <ActionIcon variant="subtle" onClick={handleEditClick}>
                                            <IconEdit size={16} />
                                        </ActionIcon>
                                        <ActionIcon color="red" variant="subtle" onClick={() => onDelete(task.id)}>
                                            <IconTrash size={16} />
                                        </ActionIcon>
                                    </>
                                )}
                            </Group>
                        </Group>

                        <Collapse in={isExpanded || isEditing}>
                        <Divider></Divider>
                            <Box mt="md">
                                {isEditing ? (
                                    <Textarea
                                        label="Описание"
                                        value={tempDescription}
                                        onChange={(e) => setTempDescription(e.currentTarget.value)}
                                        autosize
                                        minRows={2}
                                        maxRows={4}
                                    />
                                ) : (
                                    <Text size="sm" style={{ whiteSpace: 'pre-line' }}>
                                        {task.description}
                                    </Text>
                                )}
                                <Subtasks data={subtaskData} taskId={task.id} />
                            </Box>
                        </Collapse>
                    </Card>
                </Box>
            )}
        </Draggable>
    );
};

export default Task;