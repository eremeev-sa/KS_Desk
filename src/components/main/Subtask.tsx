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

type SubtaskProps = {
    id: string;
    name: string;
    onDelete: (id: string) => void;
    onUpdate: () => void;
};

const Subtask: React.FC<SubtaskProps> = ({ id, name, onDelete, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState(name);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSubtaskUpdate = async (id: string) => {
        try {
            const updatedSubtask = { name: tempName };
            await updateSubtask(id, updatedSubtask);
            onUpdate();
            setTempName("");
        } catch (error) {
            console.error("Ошибка при обновлении подзадачи:", error);
        }
    };

    const handleSaveClick = () => {
        handleSubtaskUpdate(id);
        setIsEditing(false);
    };

    const handleCancelClick = () => {
        setTempName(name);
        setIsEditing(false);
    };

    return (
        <Box py="xs">
            <Flex align="center" gap="sm">
                {isEditing ? (
                    <>
                        <TextInput
                            value={tempName}
                            onChange={(e) => setTempName(e.currentTarget.value)}
                            autoFocus
                            style={{ flex: 1 }}
                        />
                        <ActionIcon
                            color="green"
                            variant="filled"
                            onClick={handleSaveClick}
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
                    </>
                ) : (
                    <>
                        <Text
                            onDoubleClick={handleEditClick}
                            style={{ flex: 1, cursor: 'pointer' }}
                        >
                            {name}
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
                                onClick={() => onDelete(id)}
                                color="red"
                                variant="subtle"
                            >
                                <IconTrash size="1rem" />
                            </ActionIcon>
                        </Group>
                    </>
                )}
            </Flex>
        </Box>
    );
};

export default Subtask;