import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Group,
  TextInput,
  ActionIcon,
  ScrollArea,
  Divider,
  List,
  Badge,
  Menu,
  Button,
  rem,
  Space
} from '@mantine/core';
import { IconPlus, IconCheck, IconX, IconDots, IconPencil, IconTrash } from '@tabler/icons-react';
import { updateBoard, BoardRequest, createBoard, getBoards } from "../../services/Board";

type BoardListProps = {
  data: { id: string; name: string }[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, boardRequest: BoardRequest) => void;
  onBoardClick: (id: string) => void;
  currentBoardId: string;
};

const BoardList: React.FC<BoardListProps> = ({
  data,
  onDelete,
  onUpdate,
  onBoardClick,
  currentBoardId,
}) => {
  const [addNewBoard, setAddNewBoard] = useState(false);
  const [tempName, setTempName] = useState("");
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [boardsData, setBoardsData] = useState(data);

  useEffect(() => {
    setBoardsData(data);
  }, [data]);

  const handleAddClick = async () => {
    try {
      const boardRequest = { Name: tempName };
      await createBoard(boardRequest);
      const updatedBoards = await getBoards();
      setBoardsData(updatedBoards);
      setAddNewBoard(false);
      setTempName("");
    } catch (error) {
      console.error("Ошибка при добавлении доски:", error);
    }
  };

  const handleCancelClick = () => {
    setTempName("");
    setAddNewBoard(false);
  };

  const startEditing = (board: { id: string; name: string }) => {
    setEditingBoardId(board.id);
    setEditName(board.name);
  };

  const cancelEditing = () => {
    setEditingBoardId(null);
    setEditName("");
  };

  const saveEditing = async (id: string) => {
    try {
      const boardRequest = { Name: editName };
      await onUpdate(id, boardRequest);
      setEditingBoardId(null);
    } catch (error) {
      console.error("Ошибка при обновлении доски:", error);
    }
  };

  return (
    <Box p="sm">
      {/* Заголовок секции с кнопкой добавления */}
      <Group justify="space-between" mb="md" wrap="nowrap">
        <Text size="lg" fw={500}>
          Доски
        </Text>

      </Group>

      <Divider mb="sm" />

      {/* Список досок */}
      <ScrollArea scrollbars="y" w={'200px'} style={{ height: 'calc(100vh - 260px)', borderBottom: '1px solid #e9ecef' }}>
        {boardsData.length === 0 ? (
          <Text color="dimmed" ta="center" py="md">Нет досок</Text>
        ) : (
          <List spacing="xs" size="sm" withPadding={false}>
            {boardsData.map((board) => (
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
                    <TextInput
                      value={editName}
                      onChange={(e) => setEditName(e.currentTarget.value)}
                      style={{ flex: 1 }}
                      size="sm"
                      autoFocus
                    />
                    <ActionIcon
                      color="green"
                      variant="light"
                      onClick={() => saveEditing(board.id)}
                      disabled={!editName.trim()}
                    >
                      <IconCheck size={16} />
                    </ActionIcon>
                    <ActionIcon
                      color="red"
                      variant="light"
                      onClick={cancelEditing}
                    >
                      <IconX size={16} />
                    </ActionIcon>
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
            ))}
          </List>
        )}

        {/* Форма добавления новой доски */}
        {!addNewBoard && (
          <Box pt={'10px'} maw={'180px'} pb={'10px'}>
            <Button
              variant="light"
              color="gray"
              leftSection={<IconPlus size={16} />}
              onClick={() => setAddNewBoard(true)}
              fullWidth
            >
              Добавить доску
            </Button>
          </Box>
        )}
        {addNewBoard && (
          <Box mt="sm" pb={'10px'} p="xs" style={{ border: '1px solid var(--mantine-color-gray-3)', borderRadius: 'var(--mantine-radius-sm)' }}>
            <Group gap="xs" align="flex-end">
              <TextInput
                placeholder="Название доски"
                value={tempName}
                onChange={(e) => setTempName(e.currentTarget.value)}
                style={{ flex: 1 }}
                size="sm"
                autoFocus
              />
              <ActionIcon
                color="green"
                variant="light"
                onClick={handleAddClick}
                disabled={!tempName.trim()}
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
          </Box>
        )}
      </ScrollArea>
    </Box>
  );
};

export default BoardList;