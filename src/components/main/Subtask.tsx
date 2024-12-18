import React, { useState } from 'react';
import { SubtaskRequest, updateSubtask } from '../../services/Subtask';

type SubtaskProps = {
    id: string;
    name: string;
    onDelete: (id: string) => void;
    onUpdate: () => void; // Новый пропс
};

const Subtask: React.FC<SubtaskProps> = ({ id, name, onDelete, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState(name);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSubtaskUpdate = async (id: string) => {
        try {
            const updatedSubtask = {
                name: tempName,
            };
            await updateSubtask(id, updatedSubtask);

            onUpdate();
            setTempName("");
        } catch (error) {
            console.error("Ошибка при обновлении подзадачи:", error);
        }
    };

    const handleSaveClick = () => {
        handleSubtaskUpdate(id);
        setIsEditing(false);
    };

    const handleCancelClick = () => {
        setTempName(name);
        setIsEditing(false);
    };

    return (
        <div className=''>
            <div className="d-flex w-100 align-items-center justify-content-between">
                {isEditing ? (
                    <div>
                        <input
                            id="name-input"
                            title="Название задачи"
                            type="text"
                            className="form-control me-2"
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            style={{ flex: "1" }}
                        />
                    </div>
                ) : (
                    <span
                        className="text-container noselect"
                        onDoubleClick={handleEditClick}
                    >
                        {name}
                    </span>
                )}
                {isEditing ? (
                    <>
                        <button
                            className="btn btn-accept btn-sm me-2"
                            style={{ flexShrink: 0 }}
                            onClick={handleSaveClick}
                        >
                            ✔
                        </button>
                        <button
                            className="btn btn-cancel btn-sm"
                            style={{ flexShrink: 0 }}
                            onClick={handleCancelClick}
                        >
                            ✖
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className="btn btn-delete btn-sm"
                            onClick={() => onDelete(id)}
                        >
                            🗑
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Subtask;
