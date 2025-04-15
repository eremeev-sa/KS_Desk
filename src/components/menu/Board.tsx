import React, { useEffect, useState } from "react";
import { updateBoard, BoardRequest } from "../../services/Board";
import { ActionIcon, Text, Box, Group, List, Menu, TextInput, rem } from "@mantine/core";
import { IconCheck, IconDots, IconPencil, IconTrash, IconX } from "@tabler/icons-react";
import { BoardType } from "../../models/models";
import { useForm, UseFormReturnType } from "@mantine/form";

type BoardProps = {
    board: BoardType;
    currentBoardId: string;
    editingBoardId: string | null;
    handleSaveEditing: () => void;
    cancelEditing: () => void;
    startEditing: (board: BoardType) => void;
    onDelete: (id: string) => void;
    onUpdate: (id: string, boardRequest: BoardRequest) => void;
    onBoardClick: (id: string) => void;
    form: UseFormReturnType<{ boardName: string }, (values: { boardName: string }) => { boardName: string }>;
};

const Board: React.FC<BoardProps> = ({ board, currentBoardId, editingBoardId, handleSaveEditing, cancelEditing, onDelete, onUpdate, onBoardClick, startEditing, form }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState(board.name);

    useEffect(() => {
        // console.log("Полученные имена в BoardList:", tempName);
    }, [tempName]);

    const handleKeyPress = (event: any) => {
        if (event.key === 'Enter') {
            handleSaveEditing();
        }
    }

    return (
        <List.Item
            onClick={() => onBoardClick(board.id)}
            key={board.id}
            style={{
                cursor: 'pointer',
                backgroundColor: currentBoardId === board.id ? 'var(--mantine-color-blue-light)' : 'transparent',
                borderRadius: 'var(--mantine-radius-sm)',
                padding: '6px 10px',
                listStyleType: 'none',
                '&:hover': {
                    backgroundColor: 'var(--mantine-color-blue-1)'
                }
            }}
        >
            {editingBoardId === board.id ? (
                <Group gap="xs" align="flex-end">
                    <Group align="start" wrap="nowrap" gap={5}>
                        <TextInput
                            placeholder="Название доски"
                            {...form.getInputProps('boardName')}
                            style={{ flex: 1 }}
                            size="sm"
                            autoFocus
                            onKeyDown={handleKeyPress}
                        />
                        <Group mt={5} gap={5}>
                            <ActionIcon
                                onClick={handleSaveEditing}
                                color="green"
                                variant="light"
                            >
                                <IconCheck size={16} />
                            </ActionIcon>
                            <ActionIcon
                                color="red"
                                variant="light"
                                onClick={() => cancelEditing()}
                            >
                                <IconX size={16} />
                            </ActionIcon>
                        </Group>
                    </Group>
                </Group>
            ) : (
                <Group justify="space-between" wrap="nowrap" style={{ width: '100%' }}>
                    <Text
                        miw={130}
                        maw={130}
                        style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'block'
                        }}
                        onClick={() => onBoardClick(board.id)}
                    >
                        {board.name}
                    </Text>

                    <Box style={{ marginLeft: 'auto', flexShrink: 0 }}>
                        <Menu withinPortal position="bottom-end" zIndex={"1000000"} shadow="sm" offset={5}>
                            <Menu.Target>
                                <ActionIcon
                                    variant="subtle"
                                    color="gray"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <IconDots style={{ width: rem(16), height: rem(16) }} />
                                </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item
                                    leftSection={<IconPencil style={{ width: rem(14), height: rem(14) }} />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        startEditing(board);
                                    }}
                                >
                                    Редактировать
                                </Menu.Item>
                                <Menu.Item
                                    leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                                    color="red"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(board.id);
                                    }}
                                >
                                    Удалить
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Box>
                </Group>
            )}
        </List.Item>
    );
};

export default Board;
