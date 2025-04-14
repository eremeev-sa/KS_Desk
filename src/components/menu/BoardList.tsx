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
  Space,
  LoadingOverlay,
  Loader,
  Alert
} from '@mantine/core';
import { IconPlus, IconCheck, IconX, IconDots, IconPencil, IconTrash, IconInfoCircle } from '@tabler/icons-react';
import { updateBoard, BoardRequest, createBoard, getBoards } from "../../services/Board";
import Board from "./Board";
import { useForm } from "@mantine/form";
import { BoardType } from "../../models/models";
import { useDisclosure } from "@mantine/hooks";
import { relative } from "path";

type BoardListProps = {
  data: { id: string; name: string }[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, boardRequest: BoardRequest) => void;
  onBoardClick: (id: string) => void;
  currentBoardId: string;
  dataGettingLoading: boolean;
};

const BoardList: React.FC<BoardListProps> = ({
  data,
  onDelete,
  onUpdate,
  onBoardClick,
  currentBoardId,
  dataGettingLoading,
}) => {
  const [addNewBoard, setAddNewBoard] = useState(false);
  const [editingBoardId, setEditingBoardId] = useState<string>('');
  const [initialBoardEditName, setInitialBoardEditName] = useState("");
  const [boardsData, setBoardsData] = useState(data);
  const [uploadingBoardChanges, setUploadingBoardChanges] = useState(false);

  useEffect(() => {
    setBoardsData(data);
  }, [data]);

  useEffect(() => {
  }, [uploadingBoardChanges]);

  useEffect(() => {
    if (editingBoardId === "") {
      setInitialBoardEditName("");
    }
    else {
      const thisBoard = boardsData.find((e) => (e.id === editingBoardId));
      if (thisBoard != undefined) {
        setInitialBoardEditName(thisBoard.name);
      }
    }
  }, [editingBoardId])

  const form = useForm({
    initialValues: {
      boardName: ''
    },
    validate: {
      boardName: (value: string) => (
        value.trim()
          ? (boardsData.find((e) => e.name === value) === undefined
            ? null
            : "Доска с таким названием уже существует!")
          : "Введите название доски"),
    }
  });

  const editForm = useForm({
    initialValues: {
      boardName: initialBoardEditName,
    },
    validate: {
      boardName: (value: string) => (
        value.trim()
          ? (boardsData.find((e) => e.name === value) === undefined || value === initialBoardEditName
            ? null
            : "Доска с таким названием уже существует!")
          : "Введите название доски"),
    }
  });

  useEffect(() => {
    editForm.setValues({ boardName: initialBoardEditName })
  }, [initialBoardEditName])

  const handleAddClick = async () => {
    try {
      if (boardsData.find((e) => e.name === form.values.boardName) === undefined) {
        setUploadingBoardChanges(true);
        const boardRequest = { Name: form.values.boardName };
        setAddNewBoard(false);
        form.reset();
        await createBoard(boardRequest);
        const updatedBoards = await getBoards();
        setBoardsData(updatedBoards);
        setUploadingBoardChanges(false);
      }
      else {
      }
    } catch (error) {
      console.error("Ошибка при добавлении доски:", error);
    }
  };

  const deleteBoard = async (id: string) => {
    setUploadingBoardChanges(true);
    await onDelete(id);
    setUploadingBoardChanges(false);
  }

  const handleCancelClick = () => {
    form.reset();
    setAddNewBoard(false);
  };

  const startEditing = (board: BoardType) => {
    setEditingBoardId(board.id);
  };

  const cancelEditing = () => {
    setEditingBoardId('');
    editForm.reset();
  };

  const saveEditing = async () => {
    try {
      const thisboard = boardsData.find((e) => e.id === editingBoardId)
      if (thisboard != undefined && thisboard.name === editForm.values.boardName) {
        setEditingBoardId('');
      }
      else
        if (boardsData.find((e) => e.name === editForm.values.boardName) === undefined) {
          setUploadingBoardChanges(true);
          const boardRequest = { Name: editForm.values.boardName };
          await onUpdate(editingBoardId, boardRequest);
          setEditingBoardId('');
          setUploadingBoardChanges(false);
        }
        else {
        }
    } catch (error) {
      console.error("Ошибка при обновлении доски:", error);
    }
    finally {
      editForm.reset();
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

      <Divider />

      <Box pos="relative">
        <LoadingOverlay w={"200"} p={0} m={0} visible={uploadingBoardChanges} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        {/* Список досок */}
        {dataGettingLoading ? (
          <Group m="xl" justify="center">
            <Loader size="sm" />
            <Text>Загрузка...</Text>
          </Group>
        ) : (
          <Box>
            <ScrollArea scrollbars="y" w={'200px'} style={{ height: 'calc(100vh - 340px)', borderBottom: '1px solid #e9ecef' }}>
              {boardsData.length === 0 ? (
                <Text color="dimmed" ta="center" py="md">Нет досок</Text>
              ) : (
                <List spacing="xs" size="sm" withPadding={false}>
                  {boardsData.map((board) => (
                    <Board
                      board={board}
                      currentBoardId={currentBoardId}
                      editingBoardId={editingBoardId}
                      saveEditing={saveEditing}
                      cancelEditing={cancelEditing}
                      startEditing={startEditing}
                      onDelete={deleteBoard}
                      onUpdate={onUpdate}
                      onBoardClick={onBoardClick}
                      form={editForm}
                    />
                  ))}
                </List>
              )}
            </ScrollArea >
            <Group pos={"relative"} top={10} m={0} p={0}>
              {/* Форма добавления новой доски */}
              {!addNewBoard && (
                <Box p={0} m={0} miw={'100%'}>
                  <Button
                    variant="light"
                    color="gray"
                    leftSection={<IconPlus size={16} />}
                    onClick={() => setAddNewBoard(true)}
                    w={"100%"}
                  >
                    Добавить доску
                  </Button>
                </Box>
              )}
              {addNewBoard && (
                <form onSubmit={form.onSubmit(handleAddClick)}>
                  <Group align="start" wrap="nowrap" gap={5} top={0}>
                    <TextInput
                      placeholder="Название доски"
                      {...form.getInputProps('boardName')}
                      style={{ flex: 1 }}
                      size="sm"
                      autoFocus
                    />
                    <Group mt={5} gap={5}>
                      <ActionIcon
                        color="green"
                        variant="light"
                        type="submit"
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
              )
              }
            </Group>
          </Box>
        )}
      </Box >
    </Box>
  );
};

export default BoardList;