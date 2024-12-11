import React, { useEffect, useState } from 'react';
import Sidebar from '../components/menu/Sidebar';
import Columns from '../components/main/Columns';
import '../styles/custom.css';

type KanbanWindowProps = {
    onLogout: () => void;
};

const ColumnData = [
    { Id: "1", Name: "Column1", Order: 2, BoardId: "1" },
    { Id: "2", Name: "Column2", Order: 1, BoardId: "1" },
    { Id: "3", Name: "Column3", Order: 3, BoardId: "2" },
    { Id: "4", Name: "Column4", Order: 4, BoardId: "2" }
];

const KanbanWindow: React.FC<KanbanWindowProps> = ({ onLogout }) => {
    const [userName] = useState("Иван Иванов");
    const [currentBoardId, setCurrentBoardId] = useState<string>("");
    return (
        <div className="d-flex custom-gradient">
            <div className=" custom-gradient position-fixed kanban-board h-100 sidebar-content">
                <Sidebar userName={userName} onLogout={onLogout} onBoardClick={(id) => setCurrentBoardId(id)} />
            </div>

            <div className="col bg-body w-100p ms-auto">
                <Columns currentBoardId={currentBoardId}/>
            </div>
        </div>
    );
};

export default KanbanWindow;
