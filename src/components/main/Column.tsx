import React, { useEffect, useState } from 'react';
import Tasks from './Tasks';
import { ColumnRequest, getColumns, updateColumn } from '../../services/Column';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { colors } from '@atlaskit/theme';
import { getTasks, TaskRequest, TaskUpdateRequest } from '../../services/Task';
import { TaskType } from '../../models/models';

interface HeaderProps {
    isDragging: boolean;
}

const Container = styled.div`
  margin: 0px;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div<HeaderProps>`
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
    background-color: ${({ isDragging }) =>
        isDragging ? colors.Y75 : '#f4f5f6'};
    transition: background-color 0.2s ease;
    &:hover {
      background-color: #ffffff;
    }
  `;

type ColumnProps = {
    id: string;
    name: string;
    index: number;
    tasks: {
        id: string;
        name: string;
        description: string;
        priority: string;
        columnId: string;
        assigneeId: string;
    }[];

    handleTaskUpdate: (id: string, taskRequest: TaskUpdateRequest) => void;
    handleTaskLocalUpdate: () => void;
    onDelete: (id: string) => void;
    onUpdate: (id: string, columnRequest: ColumnRequest) => void;
};

const Column: React.FC<ColumnProps> = ({ id, name, index, onDelete, onUpdate, tasks, handleTaskUpdate, handleTaskLocalUpdate }) => {
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
        <Draggable draggableId={id} index={index} key={id}>
            {(provided, snapshot) => (
                <Container ref={provided.innerRef} {...provided.draggableProps}>
                    <div className="ms-4">
                        <div className="card">
                            <div className='kanban-column'>
                                <div className="custom-card-header text-center d-flex">
                                    {isEditing ? (
                                        <>
                                            <input
                                                title="Название колонки"
                                                type="text"
                                                className="form-control column me-2"
                                                value={tempName}
                                                onChange={(e) => setTempName(e.target.value)}
                                            />
                                            <div className="button-container d-flex align-items-center">
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
                                            </div>
                                        </>
                                    ) : (
                                        <div className="d-flex w-100">
                                            <Header isDragging={snapshot.isDragging}>
                                                {/* Область для перетаскивания */}
                                                <div
                                                    {...provided.dragHandleProps}
                                                    className="drag-handle center"
                                                >
                                                    ✥
                                                </div>
                                            </Header>

                                            <div
                                                style={{
                                                    fontWeight: 'bold',
                                                    margin: '8px',
                                                }}
                                            >
                                                <span
                                                    className="text-container noselect"
                                                    onDoubleClick={handleEditClick}
                                                >
                                                    {name}
                                                </span>
                                            </div>

                                            {/* Перемещаем кнопки вправо */}
                                            <div className="button-container d-flex align-items-center ms-auto">
                                                <button
                                                    className="btn btn-delete btn-sm"
                                                    onClick={() => onDelete(id)}
                                                >
                                                    🗑
                                                </button>
                                            </div>
                                        </div>

                                    )}
                                </div>
                                <div className="card-body">
                                    <Tasks tasks={tasks} handleTaskUpdate={handleTaskUpdate} handleTaskLocalUpdate={handleTaskLocalUpdate} columnId={id} />
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            )}
        </Draggable>
    )
};


export default Column;
