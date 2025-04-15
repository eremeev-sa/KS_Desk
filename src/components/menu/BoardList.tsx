import React, { useEffect, useState } from "react";
import { useUser } from '../../context/UserContext'; // Используем хук для работы с глобальным состоянием пользователя
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
  data: BoardType[];
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
  const { currentUser } = useUser(); // Получаем текущего пользователя из глобального состояния

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
      form.validate();
      if (form.values.boardName.trim() && boardsData.find((e) => e.name === form.values.boardName) === undefined) {
        setUploadingBoardChanges(true);
        const boardRequest = { name: form.values.boardName, ownerId: currentUser?.id };
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

  const handleCancelClick = () => { // Скрываем форму добавления доски
    form.reset();
    setAddNewBoard(false);
  };

  const startEditing = (board: BoardType) => { // Показываем форму редактирования доски
    setEditingBoardId(board.id);
  };

  const cancelEditing = () => { // Скрываем форму редактирования доски
    setEditingBoardId('');
    editForm.reset();
  };

  const handleSaveEditing = async () => { // Обрабатываем изменения доски
    try {
      editForm.validate();
      if (!editForm.values.boardName.trim()) { // Поле имени не пустое
        return
      }
      const thisboard = boardsData.find((e) => e.id === editingBoardId)
      if (thisboard != undefined && thisboard.name === editForm.values.boardName) { // Если название доски не поменяли, запрос в бэкенд не делаем
        setEditingBoardId('');
        editForm.reset();
      }
      else
        if (boardsData.find((e) => e.name === editForm.values.boardName) === undefined) { // Название доски уникальное => делаем запрос
          setUploadingBoardChanges(true);
          const boardRequest = { name: editForm.values.boardName, ownerId: currentUser?.id };
          await onUpdate(editingBoardId, boardRequest);
          setEditingBoardId('');
          editForm.reset();
          setUploadingBoardChanges(false);
        }
    } catch (error) {
      console.error("Ошибка при обновлении доски:", error);
    }
    finally {
    }
  };

  const handleKeyPress = (event: any) => { // Обработчик 
    if (event.key === 'Enter') {
      handleAddClick();
    }
  }

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
                      handleSaveEditing={handleSaveEditing}
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
                <Group align="start" wrap="nowrap" gap={5} top={0}>
                  <TextInput
                    placeholder="Название доски"
                    {...form.getInputProps('boardName')}
                    style={{ flex: 1 }}
                    size="sm"
                    onKeyDown={handleKeyPress}
                    autoFocus
                  />
                  <Group mt={5} gap={5}>
                    <ActionIcon
                      color="green"
                      variant="light"
                      onClick={handleAddClick}
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