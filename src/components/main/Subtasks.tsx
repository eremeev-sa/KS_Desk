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
    data: { id: string; name: string }[];
    taskId: string;
};


const Subtasks: React.FC<SubtasksProps> = ({ data, taskId }) => {
    const [addNewSubtask, setAddNewSubtask] = useState(false);
    const [localSubtasks, setLocalSubtasks] = useState<SubtaskType[]>(data);

    const form = useForm({
        initialValues: {
            subtaskName: '',
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

    const handleAddClick = async (event: any) => {
        try {
            event.preventDefault();
            const newTask = { name: form.values.subtaskName, taskId: taskId };
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
                <form onSubmit={(e) => {
                    e.preventDefault();
                    form.onSubmit(handleAddClick)
                }}>
                    <Group align="start" wrap="nowrap" gap={5} top={0}>
                        <TextInput
                            placeholder="Название подзадачи"
                            {...form.getInputProps('subtaskName')}
                            style={{ flex: 1 }}
                            autoFocus
                        />
                        <Group mt={5} gap={5}>
                            <ActionIcon
                                type="submit"
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
                </form>
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