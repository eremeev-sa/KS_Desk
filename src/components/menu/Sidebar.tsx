import React, { useState, useEffect } from "react";
import BoardList from "./BoardList";
import UserInfo from "./UserInfo";
import { getBoards, updateBoard, BoardRequest, deleteBoard } from "../../services/Board";

type SidebarProps = {
  userName: string;
  onLogout: () => void;
  onBoardClick: (id: string) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ userName, onLogout, onBoardClick }) => {
  const [data, setData] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  // Получение данных при монтировании компонента
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const boards = await getBoards(); // Запрос к API
        setData(boards); // Обновление состояния
        setLoading(false); // Данные загружены

      } catch (error) {
        console.error("Ошибка при загрузке досок:", error);
      }
    };

    fetchBoards();
  }, []);

  const handleUpdate = async (id: string, boardRequest: BoardRequest) => {
    const name = boardRequest.Name
    try {
      await updateBoard(id, boardRequest);

      const updatedBoards = await getBoards(); // Обновляем список досок с сервера
      setData(updatedBoards); // Устанавливаем новые данные в состояние
    } catch (error) {
      console.error("Ошибка при обновлении доски:", error);
    }
  };

  const handleDelete = async (id: string) => {
    console.log("Удаление доски с id:", id);
    try {
      await deleteBoard(id);
      const updatedBoards = await getBoards(); // Обновляем список досок с сервера
      setData(updatedBoards); // Устанавливаем новые данные в состояние
      onBoardClick("");
    } catch (error) {
      console.error("Ошибка при удалении доски:", error);
    }
  };

  return (
    <div className="sidebar-content">
      <UserInfo userName={userName} onLogout={onLogout} />
      {loading ? <h2>Загрузка...</h2> : <BoardList data={data} onUpdate={handleUpdate} onDelete={handleDelete} onBoardClick={onBoardClick} />}
    </div>
  );
};

export default Sidebar;
