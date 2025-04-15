import React, { FormEvent, useEffect, useState } from 'react';
import {
    createSubtask,
    deleteSubtask,
    getSubtasks
} from '../../services/Subtask';
import { SubtaskType } from '../../models/models';
import Subtask from './Subtask';
import {
    Button,
    TextInput,
    Group,
    Stack,
    List,
    ActionIcon,
    Box,
    Flex
} from '@mantine/core';
import { IconPlus, IconCheck, IconX } from '@tabler/icons-react';
import { useForm } from '@mantine/form';

type SubtasksProps = {
    data: SubtaskType[];
    taskId: string;
};


const Subtasks: React.FC<SubtasksProps> = ({ data, taskId }) => {
    const [addNewSubtask, setAddNewSubtask] = useState(false);
    const [localSubtasks, setLocalSubtasks] = useState<SubtaskType[]>(data);

    const form = useForm({
        initialValues: {
            subtaskName: '',
            description: '',
            priority: 0,
            endDate: new Date('"2025-04-14T15:54:14.358Z"'),
            assignedId: null,
        },
        validate: {
            subtaskName: (value: string) => (value.trim() ? null : 'Введите название подзадачи'),
        },
    });

    useEffect(() => {
        setLocalSubtasks(data);
    }, [data]);

    const handleSubtaskLocalUpdate = async () => {
        const updatedSubasks = await getSubtasks(taskId);
        setLocalSubtasks(updatedSubasks);
    };

    const handleAddClick = async () => {
        try {
            form.validate()
            if (!form.isValid()) {
                return;
            }
            const newTask = { name: form.values.subtaskName, 
                description: form.values.description, 
                priority: form.values.priority, 
                endDate: new Date("2025-04-14T09:54:19.742Z"), 
                assignedId: null, 
                taskId: taskId };
            await createSubtask(newTask);
            await handleSubtaskLocalUpdate();
            form.reset();
            setAddNewSubtask(false);
        } catch (error) {
            console.error("Ошибка при добавлении подзадачи:", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteSubtask(id);
            await handleSubtaskLocalUpdate();
        } catch (error) {
            console.error("Ошибка при удалении подзадачи:", error);
        }
    };

    const handleCancelClick = () => {
        form.reset();
        setAddNewSubtask(false);
    };

    const handleKeyPress = (event: any) => {
        if (event.key === 'Enter') {
            handleAddClick();
        }
    }

    return (
        <Stack gap="sm">
            <List spacing="xs" size="sm" center>
                {localSubtasks.map((subtask) => (
                    <List.Item key={subtask.id}
                        style={{
                            listStyleType: 'none',
                        }}>
                        <Subtask
                            subtask={subtask}
                            onDelete={handleDelete}
                            onUpdate={handleSubtaskLocalUpdate}
                        />
                    </List.Item>
                ))}
            </List>
            {addNewSubtask ? (
                <Group align="start" wrap="nowrap" gap={5} top={0}>
                    <TextInput
                        placeholder="Название подзадачи"
                        {...form.getInputProps('subtaskName')}
                        style={{ flex: 1 }}
                        onKeyDown={handleKeyPress}
                        autoFocus
                    />
                    <Group mt={5} gap={5}>
                        <ActionIcon
                            onClick={handleAddClick}
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
            ) : (
                <Button
                    variant="light"
                    leftSection={<IconPlus size="1rem" />}
                    onClick={() => setAddNewSubtask(true)}
                    fullWidth
                >
                    Добавить подзадачу
                </Button>
            )
            }
        </Stack >
    );
};

export default Subtasks;