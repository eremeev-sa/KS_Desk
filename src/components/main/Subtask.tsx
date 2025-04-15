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
            description: '',
            priority: 0,
            endDate: new Date('"2025-04-14T15:54:14.358Z"'),
            assignedId: null,
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
            form.validate()
            if (!form.isValid()) {
                return;
            }
            await updateSubtask(subtask.id,
                {
                    name: form.values.subtaskName,
                    description: form.values.description,
                    priority: form.values.priority,
                    endDate: new Date('"2025-04-14T15:54:14.358Z"'),
                    assignedId: null
                });
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

    const handleKeyPress = (event: any) => {
        if (event.key === 'Enter') {
            handleSaveClick();
        }
    }

    return (
        <Box py="xs">
            <Flex align="center" gap="sm">
                {isEditing ? (
                    <>
                        <Group gap={4}>
                            <TextInput
                                placeholder='Название подзадачи'
                                {...form.getInputProps('subtaskName')}
                                autoFocus
                                style={{ flex: 1 }}
                                onKeyDown={handleKeyPress}
                            />
                            <ActionIcon
                                onClick={handleSaveClick}
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
                    </>
                ) : (
                    <>
                        <Group align="start" wrap="nowrap">
                            <Text
                                onDoubleClick={handleEditClick}
                                style={{ flex: 1, cursor: 'pointer' }}
                            >
                                {subtask.name}
                            </Text>
                            <Group align="end" left={'auto'} right={20} pos={'absolute'} wrap="nowrap" gap={5}>
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
                        </Group>
                    </>
                )}
            </Flex>
        </Box >
    );
};

export default Subtask;