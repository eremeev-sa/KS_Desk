import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Column from './Column';
import { ColumnRequest, createColumn, deleteColumn, getColumns, updateColumn, updateColumnOrder } from '../../services/Column';
import { getAllTasks, TaskRequest, TaskUpdateRequest, updateTask, updateTaskColumn } from '../../services/Task';
import styled from 'styled-components';
import { TaskType } from '../../models/models';
import {
    Box,
    Text,
    TextInput,
    Button,
    Group,
    ActionIcon,
    ScrollArea
} from '@mantine/core';
import { IconPlus, IconCheck, IconX } from '@tabler/icons-react';
import classesKanbanColumns from '../../styles/KanbanColumns.module.css';
import Task from './Task';

type ColumnsProps = {
    currentBoardId: string; // Текущий идентификатор доски
};

const Container = styled.div`
  background-color: white;
  min-height: 100vh;
  min-width: 100vw; /* Минимальная ширина контейнера */
  display: inline-flex; /* Для горизонтального расположения */
`;

const Columns: React.FC<ColumnsProps> = ({ currentBoardId }) => {
    const [tasks, setTasks] = useState<TaskType[]>([]); // Состояние задач
    const [data, setData] = useState<{ id: string; name: string }[]>([]); // Состояние колонок
    const [loading, setLoading] = useState(true); // Состояние загрузки
    const [tempName, setTempName] = useState(""); // Название новой колонки
    const [addNewColumn, setAddNewColumn] = useState(false); // Флаг добавления новой колонки


    // Загрузка колонок при изменении текущей доски
    useEffect(() => {
        const fetchColumns = async () => {
            if (currentBoardId !== "") {
                try {
                    setLoading(true);
                    const columns = await getColumns(currentBoardId);
                    setData(columns);
                } catch (error) {
                    console.error("Ошибка при загрузке колонок:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setData([]); // Сбрасываем данные, если доска не выбрана
            }
        };

        fetchColumns();
    }, [currentBoardId]); // Зависимость — currentBoardId

    // Загрузка задач после получения колонок
    useEffect(() => {
        const loadAllTasks = async () => {
            if (data.length > 0) {
                const columnIds = data.map(column => column.id);  // Получаем список всех columnId
                const allTasks = await getAllTasks(columnIds);  // Загружаем все задачи для этой доски
                setTasks(allTasks);
            }
        };

        loadAllTasks();
    }, [data]);

    // Добавление новой колонки
    const handleAddClick = async () => {
        try {
            const columnRequest = { name: tempName, boardId: currentBoardId };
            await createColumn(columnRequest);
            const updatedBoards = await getColumns(currentBoardId);
            setData(updatedBoards);
            setAddNewColumn(false);
            // Очищаем поле ввода
            setTempName("");
            console.log(data);
        } catch (error) {
            console.error("Ошибка при добавлении доски:", error);
        }
    };

    const handleCancelClick = () => {
        setTempName("");
        setAddNewColumn(false);
    };

    // Обновление колонки
    const handleUpdate = async (id: string, columnRequest: ColumnRequest) => {
        const name = columnRequest.name
        try {
            await updateColumn(id, columnRequest);

            const updatedBoards = await getColumns(currentBoardId);
            setData(updatedBoards);
        } catch (error) {
            console.error("Ошибка при обновлении доски:", error);
        }
    };

    // Удаление колонки
    const handleDelete = async (id: string) => {
        try {
            await deleteColumn(id);
            const updatedBoards = await getColumns(currentBoardId); // Обновляем список досок с сервера
            setData(updatedBoards); // Устанавливаем новые данные в состояние
        } catch (error) {
            console.error("Ошибка при удалении колонки:", error);
        }
    };

    // Обновление задач в текущей доске для локального хранения
    const handleTaskLocalUpdate = async () => {
        if (data.length > 0) {
            const columnIds = data.map(column => column.id);
            const allTasks = await getAllTasks(columnIds);
            setTasks(allTasks);
        }
    };

    // Обновление задачи
    const handleTaskUpdate = async (id: string, taskRequest: TaskUpdateRequest) => {
        try {
            await updateTask(id, taskRequest);
            handleTaskLocalUpdate();
        } catch (error) {
            console.error("Ошибка при обновлении задачи:", error);
        }
    };

    // Обработка завершения перетаскивания
    const handleOnDragEnd = async (result: any) => {
        const { source, destination, type } = result;
        // Если задача не была перемещена (находится в том же месте)
        if (!destination) return;


        // Получение ID колонки, в которую была перемещена задача
        const targetColumnId = result.destination.droppableId;
        console.log("Задача перемещена в колонку с ID:", targetColumnId);
        // Логика для перемещения колонок
        if (type === "COLUMN") {
            // Получение новый порядок колонок
            const reorderedColumns = Array.from(data);
            const [movedColumn] = reorderedColumns.splice(source.index, 1);
            reorderedColumns.splice(destination.index, 0, movedColumn);

            // Отправление нового поряка на сервер
            const orderedColumnIds = reorderedColumns.map((column) => column.id);
            try {
                setData(reorderedColumns); // Обновление локальных данных
                await updateColumnOrder({ orderedColumnIds });
            } catch (error) {
                console.error('Ошибка при обновлении порядка колонок:', error);
            }

            return;
        }

        // Логика для перемещения задач
        else if (type === "TASK") {
            // Получение ID задачи
            const taskId = result.draggableId;
            const task = tasks.find(task => task.id === taskId);
            const changedTasks = Array.from(tasks);
            if(task === undefined)
            {
                return;
            }
            changedTasks.forEach(task => {
                if (task.id === taskId) {
                    task.columnId = targetColumnId;
                    console.log("Changed task column!");
                }
            });
            //const changedTasks = Array.from(tasks).filter((task) => task.id != taskId);
            task.columnId = targetColumnId;
            //changedTasks.unshift(task);
            setTasks(changedTasks);
            console.log(tasks); 
            try {
                await updateTaskColumn(taskId, targetColumnId);
                handleTaskLocalUpdate();
            } catch (error) {
                console.error("Ошибка при обновлении порядка задач:", error);
            }

            return;
        }
    };


    return (
        <ScrollArea w={'100vw'} h={'100vh'}
            className={classesKanbanColumns.kanbanColumnsContainer}
        >
            <Group wrap="nowrap" ml="sm" align="flex-start" pt="md">
                {loading ? (
                    <Text ml="sm">Загрузка...</Text>
                ) : (
                    <>
                        <DragDropContext onDragEnd={handleOnDragEnd}>
                            <Droppable
                                droppableId={currentBoardId}
                                type="COLUMN"
                                direction="horizontal"
                                isCombineEnabled={false}
                            >
                                {(provided) => (
                                    <Group
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        align="flex-start"
                                        gap="sm"
                                        wrap="nowrap"
                                        style={{
                                            paddingBottom: 16 // Для скролла
                                        }}
                                    >
                                        {data.map((column, index) => (
                                            <Column
                                                key={column.id}
                                                {...column}
                                                index={index}
                                                onUpdate={handleUpdate}
                                                onDelete={handleDelete}
                                                tasks={tasks}
                                                handleTaskUpdate={handleTaskUpdate}
                                                handleTaskLocalUpdate={handleTaskLocalUpdate}
                                            />
                                        ))}
                                        {provided.placeholder}
                                    </Group>
                                )}
                            </Droppable>
                        </DragDropContext>

                        {/* Кнопка добавления внутри ScrollArea */}
                        {!addNewColumn && (
                            <Box mr="10px" style={{ minWidth: 250, flexShrink: 0 }}>
                                <Button
                                    variant="light"
                                    color="gray"
                                    leftSection={<IconPlus size={16} />}
                                    onClick={() => setAddNewColumn(true)}
                                    fullWidth
                                >
                                    Добавить колонку
                                </Button>
                            </Box>
                        )}
                        {/* Форма добавления новой колонки (фиксированная внизу) */}
                        {addNewColumn && (
                            <Box
                                mt="sm"
                                style={{
                                    width: 250,
                                    position: 'sticky',
                                    left: 0,
                                    bottom: 0,
                                    background: 'var(--mantine-color-body)',
                                    zIndex: 10
                                }}
                            >
                                <TextInput
                                    placeholder="Название колонки"
                                    value={tempName}
                                    onChange={(e) => setTempName(e.currentTarget.value)}
                                    mb="sm"
                                />
                                <Group>
                                    <Button
                                        variant="light"
                                        color="green"
                                        size="sm"
                                        leftSection={<IconCheck size={16} />}
                                        onClick={handleAddClick}
                                    >
                                        Добавить
                                    </Button>
                                    <Button
                                        variant="light"
                                        color="red"
                                        size="sm"
                                        leftSection={<IconX size={16} />}
                                        onClick={handleCancelClick}
                                    >
                                        Отмена
                                    </Button>
                                </Group>
                            </Box>
                        )}
                    </>
                )}
            </Group>
        </ScrollArea >
    );
};

export default Columns;
