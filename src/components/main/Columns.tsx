import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Column from './Column';
import { ColumnRequest, createColumn, deleteColumn, getColumns, updateColumn, updateColumnOrder } from '../../services/Column';
import styled from 'styled-components';

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

    // Функция для добавления новой доски
    const handleAddClick = async () => {
        try {
            const columnRequest = { name: tempName, boardId: currentBoardId }; // Формируем объект для API
            await createColumn(columnRequest); // Отправляем запрос на создание доски
            const updatedBoards = await getColumns(currentBoardId); // Обновляем список досок с сервера
            setData(updatedBoards); // Устанавливаем новые данные в состояние
            setAddNewColumn(false);
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

    // Функция для обработки завершения перетаскивания
    const handleOnDragEnd = async (result: any) => {
        const { source, destination } = result;

        // Если задача не была перемещена (находится в том же месте)
        if (!destination) return;

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
    };

    return (
        <div>
            <div className='mt-4'>
                <div className="kanban-columns-container custom-scrollbar">
                    {loading ? (
                        <p>Загрузка...</p>
                    ) : (
                        <>
                            <DragDropContext onDragEnd={handleOnDragEnd}>
                                <Droppable
                                    droppableId={`board`}
                                    type="COLUMN"
                                    direction="horizontal"
                                    ignoreContainerClipping={Boolean(400)}
                                    isCombineEnabled={false}
                                >
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            style={{
                                                display: 'flex', // Устанавливаем flex-контейнер
                                                flexDirection: 'row', // Горизонтальное направление
                                                gap: '16px', // Расстояние между колонками (опционально)
                                            }}
                                        >
                                            {data.map((column, index) => (
                                                <Column
                                                    key={column.id}
                                                    {...column}
                                                    index={index}
                                                    onUpdate={handleUpdate}
                                                    onDelete={handleDelete} />
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}

                                </Droppable>
                            </DragDropContext>
                            {addNewColumn ? <>
                                <div className="">

                                    <div className="kanban-column ms-4">
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
                                    <div className="button-container">
                                        <button
                                            className="btn btn-success btn-sm"
                                            onClick={handleAddClick} // Добавление новой записи
                                        >
                                            ✔
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={handleCancelClick} // Отмена
                                        >
                                            ✖
                                        </button>
                                    </div>
                                </div>

                            </> :
                                <div className="mb-4 ms-4">
                                    <button className="btn btn-success w-100 me-2" onClick={() => setAddNewColumn(true)}>+</button>
                                </div>}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Columns;
