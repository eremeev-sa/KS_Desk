import React from 'react';
import KanbanBoard from './KanbanBoard';
import KanbanColumns from './KanbanColumn';
import '../custom.css';

type KanbanWindowProps = {
    onLogout: () => void;
};

const KanbanBoardData = [
    { Id: 1, Name: "Project" },
    { Id: 2, Name: "Project2" }
]

const KanbanColumnData = [
    { Id: 1, Name: "Column1", Order: 2 },
    { Id: 2, Name: "Column2", Order: 1 },
    { Id: 3, Name: "Column3", Order: 3 },
    { Id: 4, Name: "Column4", Order: 4 }
]

const KanbanWindow: React.FC<KanbanWindowProps> = ({ onLogout }) => {
    return (
        <div className="">
            <div className="row">
                <div className="custom-gradient col-md-2 h-100 border-end">
                    <KanbanBoard onLogout={() => true} data={KanbanBoardData} />
                </div>

                <div className="col-md-10 bg-body">
                    <KanbanColumns data={KanbanColumnData} />
                </div>
            </div>
        </div>
    );
};

export default KanbanWindow;
