import React, { useEffect, useState } from 'react';
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

type SubtaskProps = {
    data: { id: string; name: string }[];
    taskId: string;
};

const Subtasks: React.FC<SubtaskProps> = ({ data, taskId }) => {
    const [addNewSubtask, setAddNewSubtask] = useState(false);
    const [tempSubtaskName, setTempSubtaskName] = useState("");
    const [localSubtasks, setLocalSubtasks] = useState<SubtaskType[]>(data);

    useEffect(() => {
        setLocalSubtasks(data);
    }, [data]);

    const handleSubtaskLocalUpdate = async () => {
        const updatedSubasks = await getSubtasks(taskId);
        setLocalSubtasks(updatedSubasks);
    };

    const handleAddClick = async () => {
        try {
            const newTask = { name: tempSubtaskName, taskId: taskId };
            await createSubtask(newTask);

            handleSubtaskLocalUpdate();
            setTempSubtaskName("");
            setAddNewSubtask(false);
        } catch (error) {
            console.error("Ошибка при добавлении подзадачи:", error);
        }
    };

    const handleDelete = async (id: string) => {
        console.log("Удаление доски с id:", id);
        try {
            await deleteSubtask(id);
            const updatedSubasks = await getSubtasks(taskId);
            setLocalSubtasks(updatedSubasks);
        } catch (error) {
            console.error("Ошибка при удалении подзадачи:", error);
        }
    };

    const handleCancelClick = () => {
        setTempSubtaskName("");
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
                            id={subtask.id}
                            name={subtask.name}
                            onDelete={handleDelete}
                            onUpdate={handleSubtaskLocalUpdate}
                        />
                    </List.Item>
                ))}
            </List>

            {addNewSubtask ? (
                <Box>
                    <Flex gap="sm" align="center">
                        <TextInput
                            placeholder="Название подзадачи"
                            value={tempSubtaskName}
                            onChange={(e) => setTempSubtaskName(e.currentTarget.value)}
                            style={{ flex: 1 }}
                        />
                        <Group gap={4}>
                            <ActionIcon
                                color="green"
                                variant="filled"
                                onClick={handleAddClick}
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
                    </Flex>
                </Box>
            ) : (
                <Button
                    variant="light"
                    leftSection={<IconPlus size="1rem" />}
                    onClick={() => setAddNewSubtask(true)}
                    fullWidth
                >
                    Добавить подзадачу
                </Button>
            )}
        </Stack>
    );
};

export default Subtasks;