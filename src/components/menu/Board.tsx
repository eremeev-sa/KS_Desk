import React, { useEffect, useState } from "react";
import { updateBoard, BoardRequest } from "../../services/Board";

type BoardProps = {
    Id: string;
    Name: string;
    onDelete: (id: string) => void;
    onUpdate: (id: string, boardRequest: BoardRequest) => void;
    onBoardClick: (id: string) => void;
};

const Board: React.FC<BoardProps> = ({ Id, Name, onDelete, onUpdate, onBoardClick }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState(Name);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        const boardRequest = { Id: Id, Name: tempName };
        onUpdate(Id, boardRequest);
        setIsEditing(false);
    };

    const handleCancelClick = () => {
        setTempName(Name);
        setIsEditing(false);
    };

    useEffect(() => {
        console.log("Полученные имена в BoardList:", tempName);
    }, [tempName]);

    return (
        <div
            onClick={() => onBoardClick(Id)}
            className="list-group-item d-flex align-items-center justify-content-between custom-gradient"
        >
            {isEditing ? (
                <>
                    <input
                        title="Название доски"
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
                    <span className="text-container">{Name}</span>
                    <div className="button-container d-flex align-items-center">
                        <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={handleEditClick}
                        >
                            ✎
                        </button>
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={() => onDelete(Id)}
                        >
                            🗑
                        </button>
                    </div>
                </div>
            )}
        </div>

    );
};

export default Board;
