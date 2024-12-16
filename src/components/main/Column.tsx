import React, { useEffect, useState } from 'react';
import Tasks from './Tasks';
import { ColumnRequest, getColumns, updateColumn } from '../../services/Column';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { colors } from '@atlaskit/theme';
import { getTasks, TaskRequest } from '../../services/Task';
import { TaskType } from '../../models/models';

interface HeaderProps {
    isDragging: boolean;
}

const Container = styled.div`
  margin: ${0}px;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div<HeaderProps>`
    display: flex;
    align-items: center;
    justify-content: center;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
    background-color: ${({ isDragging }) =>
        isDragging ? colors.G50 : colors.N30};
    transition: background-color 0.2s ease;
    &:hover {
      background-color: ${colors.G50};
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
        assignedUserId: string;
    }[];

    handleTaskUpdate: (id: string, taskRequest: TaskRequest) => void;
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
                                            <span className="text-container">{name}</span>
                                        </div>

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
                                <Tasks tasks={tasks} handleTaskUpdate={handleTaskUpdate} handleTaskLocalUpdate={handleTaskLocalUpdate} columnId={id} />
                            </div>
                        </div>
                    </div>
                </Container>
            )}
        </Draggable>
    )
};


export default Column;
