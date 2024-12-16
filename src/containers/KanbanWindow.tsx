import React, { useEffect, useState } from 'react';
import Sidebar from '../components/menu/Sidebar';
import Columns from '../components/main/Columns';
import '../styles/custom.css';
import { useUser } from '../context/UserContext'; // Импортируем хук для глобального состояния

type KanbanWindowProps = {
    onLogout: () => void;
};

const KanbanWindow: React.FC<KanbanWindowProps> = ({ onLogout }) => {
    const { currentUser, setCurrentUser } = useUser();
    const [userName] = useState(currentUser);
    const [currentBoardId, setCurrentBoardId] = useState<string>("");
    return (
        <div className="d-flex custom-gradient">
            <div className=" custom-gradient position-fixed kanban-board h-100 sidebar-content">
                <Sidebar currentBoardId={currentBoardId} userName={userName} onLogout={onLogout} onBoardClick={(id) => setCurrentBoardId(id)} />
            </div>

            <div className="col bg-body w-100p ms-auto">
                <Columns currentBoardId={currentBoardId}/>
            </div>
        </div>
    );
};

export default KanbanWindow;
