import React, { useState } from 'react';
import Tasks from './Tasks';
import { ColumnRequest, getColumns, updateColumn } from '../../services/Column';

type ColumnProps = {
    id: string;
    name: string;
    onDelete: (id: string) => void;
    onUpdate: (id: string, columnRequest: ColumnRequest) => void;
};

const TaskData = [
    { Id: "1", Name: "Task1", Assignee: "1", Priority: 1, Description: "Description", ColumnId: 1 },
    { Id: "2", Name: "Task2", Assignee: "1", Priority: 1, Description: "Description", ColumnId: 1 },
    { Id: "3", Name: "Task3", Assignee: "1", Priority: 1, Description: "Description", ColumnId: 2 },
    { Id: "4", Name: "Task1", Assignee: "1", Priority: 1, Description: "Description", ColumnId: 4 },
    { Id: "5", Name: "Task2", Assignee: "1", Priority: 1, Description: "Description", ColumnId: 2 },
    { Id: "6", Name: "Task3", Assignee: "1", Priority: 1, Description: "Description", ColumnId: 3 },
    { Id: "7", Name: "Task4", Assignee: "1", Priority: 1, Description: "Description", ColumnId: 3 }
];

const Column: React.FC<ColumnProps> = ({ id, name, onDelete, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState(name);
    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        const columnRequest = { id: id, name: tempName };
        onUpdate(id, columnRequest);
        setIsEditing(false);
    };

    const handleCancelClick = () => {
        setTempName(name);
        setIsEditing(false);
    };

    return (
        <div className="kanban-column ms-4">
            <div className="card">
                <div className="card-header text-center d-flex">
                    {isEditing ? (
                        <>
                            <input
                                title="Название колонки"
                                type="text"
                                className="form-control me-2"
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                style={{ flex: "1" }}
                            />
                            <div className="button-container d-flex align-items-center">
                                <button
                                    className="btn btn-success btn-sm me-2"
                                    style={{ flexShrink: 0 }}
                                    onClick={handleSaveClick}
                                >
                                    ✔
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    style={{ flexShrink: 0 }}
                                    onClick={handleCancelClick}
                                >
                                    ✖
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="d-flex w-100 align-items-center justify-content-between">
                            {name}
                            <div className="button-container d-flex align-items-center">
                                <button
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={handleEditClick}
                                >
                                    ✎
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => onDelete(id)}
                                >
                                    🗑
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="card-body">
                    <Tasks data={TaskData} columnId={id} />
                </div>
            </div>
        </div>
    );
};

export default Column;
