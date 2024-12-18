import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Column from './Column';
import { ColumnRequest, createColumn, deleteColumn, getColumns, updateColumn, updateColumnOrder } from '../../services/Column';
import { getAllTasks, TaskRequest, TaskUpdateRequest, updateTask, updateTaskColumn } from '../../services/Task';
import styled from 'styled-components';
import { TaskType } from '../../models/models';

type ColumnsProps = {
    currentBoardId: string;
};

const Container = styled.div`
  background-color: white;
  min-height: 100vh;
  /* like display:flex but will allow bleeding over the window width */
  min-width: 100vw;
  display: inline-flex;
`;

const Columns: React.FC<ColumnsProps> = ({ currentBoardId }) => {
    const [tasks, setTasks] = useState<TaskType[]>([]); // Хранение задач
    const [data, setData] = useState<{ id: string; name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [tempName, setTempName] = useState("");
    const [addNewColumn, setAddNewColumn] = useState(false);


    // Получение данных при изменении currentBoardId
    useEffect(() => {
        const fetchColumns = async () => {
            if (currentBoardId !== "") {
                try {
                    setLoading(true); // Начинаем загрузку
                    const columns = await getColumns(currentBoardId); // Запрос к API
                    setData(columns); // Обновляем состояние
                } catch (error) {
                    console.error("Ошибка при загрузке колонок:", error);
                } finally {
                    setLoading(false); // Завершаем загрузку
                }
            } else {
                setData([]); // Сбрасываем данные, если currentBoardId пустой
            }
        };

        fetchColumns();
    }, [currentBoardId]); // Зависимость — currentBoardId

    useEffect(() => {
        // Получаем задачи для всех колонок после того, как получили их список
        const loadAllTasks = async () => {
            if (data.length > 0) {
                const columnIds = data.map(column => column.id);  // Получаем список всех columnId
                const allTasks = await getAllTasks(columnIds);  // Загружаем все задачи
                setTasks(allTasks);  // Обновляем состояние с задачами
            }
        };

        loadAllTasks();
    }, [data]);

    // Функция для добавления новой доски
    const handleAddClick = async () => {
        try {
            const columnRequest = { name: tempName, boardId: currentBoardId }; // Формируем объект для API
            await createColumn(columnRequest); // Отправляем запрос на создание доски
            const updatedBoards = await getColumns(currentBoardId); // Обновляем список досок с сервера
            setData(updatedBoards); // Устанавливаем новые данные в состояние
            setAddNewColumn(false);
            // Очищаем поле ввода
            setTempName("");
            console.log(data);
        } catch (error) {
            console.error("Ошибка при добавлении доски:", error); // Логируем ошибки
        }
    };

    const handleCancelClick = () => {
        setTempName("");
        setAddNewColumn(false);
    };


    const handleUpdate = async (id: string, columnRequest: ColumnRequest) => {
        const name = columnRequest.name
        try {
            await updateColumn(id, columnRequest);

            const updatedBoards = await getColumns(currentBoardId); // Обновляем список досок с сервера
            setData(updatedBoards); // Устанавливаем новые данные в состояние
        } catch (error) {
            console.error("Ошибка при обновлении доски:", error);
        }
    };

    const handleDelete = async (id: string) => {
        console.log("Удаление доски с id:", id);
        try {
            await deleteColumn(id);


            const updatedBoards = await getColumns(currentBoardId); // Обновляем список досок с сервера
            setData(updatedBoards); // Устанавливаем новые данные в состояние
        } catch (error) {
            console.error("Ошибка при удалении доски:", error);
        }
    };

    const handleTaskLocalUpdate = async () => {
        if (data.length > 0) {
            const columnIds = data.map(column => column.id);  // Получаем список всех columnId
            const allTasks = await getAllTasks(columnIds);  // Загружаем все задачи
            setTasks(allTasks);  // Обновляем состояние с задачами
        }
    };

    const handleTaskUpdate = async (id: string, taskRequest: TaskUpdateRequest) => {
        try {
            await updateTask(id, taskRequest);
            handleTaskLocalUpdate();
        } catch (error) {
            console.error("Ошибка при обновлении задачи:", error);
        }
    };

    // Функция для обработки завершения перетаскивания
    const handleOnDragEnd = async (result: any) => {
        const { source, destination, type } = result;
        // Если задача не была перемещена (находится в том же месте)
        if (!destination) return;

        // Получаем ID задачи (source.draggableId)
        const taskId = result.draggableId;
        console.log("Задача с ID", taskId, "перемещена");

        // Получаем ID колонки, в которую была перемещена задача
        const targetColumnId = result.destination.droppableId;
        console.log("Задача перемещена в колонку с ID:", targetColumnId);
        // Логика для перемещения колонок
        if (type === "COLUMN") {
            // Получаем новый порядок колонок
            const reorderedColumns = Array.from(data);
            const [movedColumn] = reorderedColumns.splice(source.index, 1);
            reorderedColumns.splice(destination.index, 0, movedColumn);

            // Отправляем новый порядок на сервер
            const orderedColumnIds = reorderedColumns.map((column) => column.id);
            try {
                await updateColumnOrder({ orderedColumnIds });
                setData(reorderedColumns); // Обновляем данные в состоянии
            } catch (error) {
                console.error('Ошибка при обновлении порядка колонок:', error);
            }

            return;
        }

        else if (type === "TASK") {
            try {
                // Отправляем обновление на сервер с полным объектом задачи
                await updateTaskColumn(taskId, targetColumnId);

                handleTaskLocalUpdate();
            } catch (error) {
                console.error("Ошибка при обновлении порядка задач:", error);
            }

            return;
        }



        // Можно добавить дополнительные проверки или другие типы для других объектов
    };


    return (
        <div className="kanban-columns-container mt-4">
            {loading ? (
                <p className='ms-2'>Загрузка...</p>
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
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                    }}
                                >
                                    {data.map((column, index) => (
                                        <Column
                                            key={column.id}
                                            {...column}
                                            index={index}
                                            onUpdate={handleUpdate}
                                            onDelete={handleDelete}
                                            tasks={tasks.filter(task => task.columnId === column.id)}
                                            handleTaskUpdate={handleTaskUpdate}
                                            handleTaskLocalUpdate={handleTaskLocalUpdate}
                                        />
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}

                        </Droppable>
                    </DragDropContext>
                    {addNewColumn ? <>
                        <div className="new-column">
                            <div className="ms-4">
                                <div className="card">
                                    <input
                                        title="Название доски"
                                        placeholder="Название доски"
                                        type="text"
                                        className="form-control me-2"
                                        value={tempName} // Используем состояние для ввода
                                        onChange={(e) => setTempName(e.target.value)} // Обновляем tempName при вводе
                                    />
                                    <div className="card-body">
                                    </div>
                                </div>
                            </div>
                            <div className="button-container ms-4">
                                <button
                                    className="btn btn-accept btn-sm"
                                    onClick={handleAddClick} // Добавление новой записи
                                >
                                    ✔
                                </button>
                                <button
                                    className="btn btn-cancel btn-sm"
                                    onClick={handleCancelClick} // Отмена
                                >
                                    ✖
                                </button>
                            </div>
                        </div>

                    </> :
                        <div className="mb-4 ms-4 new-column">
                            <button
                                className="btn btn-add w-100 bth-add-task center"
                                onClick={() => setAddNewColumn(true)}>
                                +
                                <div className='text-on-bth'>
                                    Добавить колонку
                                </div>
                            </button>
                        </div>
                    }
                </>
            )}
        </div>
    );
};

export default Columns;
