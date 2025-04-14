import React, { useState } from 'react';
import { updateSubtask } from '../../services/Subtask';
import {
    Group,
    Text,
    TextInput,
    ActionIcon,
    Box,
    Flex
} from '@mantine/core';
import { IconCheck, IconX, IconTrash, IconEdit } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { SubtaskType } from '../../models/models';

type SubtaskProps = {
    subtask: SubtaskType;
    onDelete: (id: string) => void;
    onUpdate: () => void;
};

const Subtask: React.FC<SubtaskProps> = ({ subtask, onDelete, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);

    const form = useForm({
        initialValues: {
            subtaskName: '',
        },
        validate: {
            subtaskName: (value: string) => (value.trim() ? null : 'Введите название подзадачи'),
        },
    });

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        try {
            await updateSubtask(subtask.id, { name: form.values.subtaskName });
            onUpdate();
            form.reset();
            setIsEditing(false);
        } catch (error) {
            console.error("Ошибка при обновлении подзадачи:", error);
        }
    };

    const handleCancelClick = () => {
        form.reset();
        setIsEditing(false);
    };

    return (
        <Box py="xs">
            <Flex align="center" gap="sm">
                {isEditing ? (
                    <>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault(); // защитимся от автоотправки
                                form.onSubmit(handleSaveClick)(e); // вызовем сохранение через mantine
                            }}
                        >
                            <Group gap={4}>
                                <TextInput
                                    placeholder='Название подзадачи'
                                    {...form.getInputProps('subtaskName')}
                                    autoFocus
                                    style={{ flex: 1 }}
                                />
                                <ActionIcon
                                    type='submit'
                                    color="green"
                                    variant="filled"
                                >
                                    <IconCheck size="1rem" />
                                </ActionIcon>
                                <ActionIcon
                                    color="red"
                                    variant="filled"
                                    onClick={handleCancelClick}
                                >
                                    <IconX size="1rem" />
                                </ActionIcon>
                            </Group>
                        </form>
                    </>
                ) : (
                    <>
                        <Text
                            onDoubleClick={handleEditClick}
                            style={{ flex: 1, cursor: 'pointer' }}
                        >
                            {subtask.name}
                        </Text>
                        <Group gap={4}>
                            <ActionIcon
                                onClick={handleEditClick}
                                variant="subtle"
                                color="gray"
                            >
                                <IconEdit size="1rem" />
                            </ActionIcon>
                            <ActionIcon
                                onClick={() => onDelete(subtask.id)}
                                color="red"
                                variant="subtle"
                            >
                                <IconTrash size="1rem" />
                            </ActionIcon>
                        </Group>
                    </>
                )}
            </Flex>
        </Box >
    );
};

export default Subtask;