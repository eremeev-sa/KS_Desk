import React, { useEffect, useState } from "react";
import Board from "./Board";
import { updateBoard, BoardRequest, createBoard, getBoards } from "../../services/Board";

type BoardListProps = {
  data: { id: string; name: string }[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, boardRequest: BoardRequest) => void;
  onBoardClick: (id: string) => void;
  currentBoardId: string;
};

const BoardList: React.FC<BoardListProps> = ({ data, onDelete, onUpdate, onBoardClick, currentBoardId }) => {
  const [addNewBoard, setAddNewBoard] = useState(false);
  const [tempName, setTempName] = useState("");
  const [boardsData, setBoardsData] = useState(data);
  useEffect(() => {
    setBoardsData(data);
    console.log("Полученные данные в BoardList:", data);
  }, [data]);

  // Функция для добавления новой доски
  const handleAddClick = async () => {
    try {
      const boardRequest = { Name: tempName }; // Формируем объект для API
      await createBoard(boardRequest); // Отправляем запрос на создание доски
      const updatedBoards = await getBoards(); // Обновляем список досок с сервера
      setBoardsData(updatedBoards); // Устанавливаем новые данные в состояние
      setAddNewBoard(false); // Закрываем форму
      console.log(boardsData);
      setTempName(""); // Очищаем временное название
    } catch (error) {
      console.error("Ошибка при добавлении доски:", error); // Логируем ошибки
    }
  };

  const handleCancelClick = () => {
    setTempName("");
    setAddNewBoard(false);
  };

  return (
    <div className="">
      <div className="sidebar-title">
        <h3 className="board-info">Доски</h3>
        {addNewBoard ? <>
        </> :
          <button
            className="btn btn-add"
            onClick={() => setAddNewBoard(true)}>
            +
          </button>}
      </div>
      <div className="boards-list">
        {boardsData.length === 0 ? <a className="center">Нет досок</a> : <div></div>}
        {boardsData.map(board => (
          <div
            key={board.id}
            className={`kanban-boards custom-button ${currentBoardId === board.id ? "selected" : "custom-color"}`} // Добавляем класс, если доска выбрана
          >
            <Board
              key={board.id}
              Id={board.id}
              Name={board.name}
              onDelete={onDelete}
              onUpdate={onUpdate}
              onBoardClick={onBoardClick}
            />
          </div>
        ))}
        {addNewBoard ? <>
          <div className="list-group-item new-board d-flex align-items-center justify-content-between">
            <input
              title="Название доски"
              placeholder="Название доски"
              type="text"
              className="form-control board me-2"
              value={tempName} // Используем состояние для ввода
              onChange={(e) => setTempName(e.target.value)} // Обновляем tempName при вводе
            />
            <div className="button-container">
              <button
                className="btn btn-accept btn-sm"
                onClick={handleAddClick} // Добавление новой записи
              >
                ✔
              </button>
              <button
                className="btn btn-cance btn-sm"
                onClick={handleCancelClick} // Отмена
              >
                ✖
              </button>
            </div>
          </div>
        </> :
          <div>

          </div>}
      </div>

    </div>
  );
};

export default BoardList;
