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
            {isEditing ? (
                <div>
                    <label htmlFor="name-input">Название</label>
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
                <div>
                    {name}
                </div>
            )}
            {isEditing ? (
                <>
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
                </>
            ) : (
                <>
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
                </>
            )}
        </div>
    );
};

export default Subtask;
