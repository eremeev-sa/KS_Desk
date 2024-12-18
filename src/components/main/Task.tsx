import React, { useEffect, useState } from 'react';
import Subtasks from './Subtasks';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { colors } from '@atlaskit/theme';
import { TaskRequest, TaskUpdateRequest } from '../../services/Task';
import { SubtaskType, TaskType } from '../../models/models';
import Select from "react-select";
import { getSubtasks } from '../../services/Subtask';

interface HeaderProps {
    isDragging: boolean;
}

type TaskProps = {
    task: {
        id: string;
        name: string;
        description: string;
        priority: string;
        columnId: string;
        assigneeId: string;
    };
    index: number;
    onDelete: (id: string) => void;
    handleTaskUpdate: (id: string, taskRequest: TaskUpdateRequest) => void;
    usersData: {
        id: string,
        name: string,
        login: string
        password: string
    }[]
};
const Container = styled.div`
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background-color: #ffffff;
    width: 304px;
    padding: 16px;
    margin-bottom: 8px;
    border: none;
`;


const Header = styled.div<HeaderProps>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 190px;
    height: 40px;
    font-size: 16px;
    border-radius: 10px;
    background-color: ${({ isDragging }) => (isDragging ? '#a6a6a8' : '#f9f9f9')};
    cursor: grab;
    transition: background-color 0.2s ease;
    &:hover {
        background-color: #f1f1f1;
    }
`;


const Task: React.FC<TaskProps> = ({ task, index, onDelete, handleTaskUpdate, usersData }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState(task.name);
    const [tempUser, setTempUser] = useState(task.assigneeId);
    const [tempDescription, setDescription] = useState(task.description);
    const [tempPriority, setPriority] = useState(task.priority);
    const [subtaskData, setSubtaskData] = useState<SubtaskType[]>([]);

    // Подготовка данных для react-select
    const userOptions = usersData.map((user) => ({
        value: user.id,
        label: user.name,
    }));

    // Слежение за изменениями в tasks и обновление локального состояния
    useEffect(() => {
        const fetchColumns = async () => {
            const subtasks = await getSubtasks(task.id);
            setSubtaskData(subtasks);
        }
        fetchColumns();
    }, []); // Обновляется каждый раз, когда tasks изменяется

    // Опции для выбора приоритета
    const priorityOptions = [
        { value: 'Низкий', label: 'Низкий' },
        { value: 'Средний', label: 'Средний' },
        { value: 'Высокий', label: 'Высокий' },
    ];

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        const taskRequest = { name: tempName, description: tempDescription, priority: tempPriority, assigneeId: tempUser };
        handleTaskUpdate(task.id, taskRequest);
        setIsEditing(false);
    };

    const handleCancelClick = () => {
        setTempName(task.name);
        setIsEditing(false);
    };

    const getPriorityClass = (priority: string) => {
        switch (priority) {
            case 'Низкий':
                return 'priority-low';
            case 'Средний':
                return 'priority-medium';
            case 'Высокий':
                return 'priority-high';
            default:
                return '';
        }
    };



    return (
        <Draggable draggableId={task.id} index={index} key={task.id}>
            {(provided, snapshot) => (
                <Container ref={provided.innerRef} {...provided.draggableProps}>
                    <div className='task'>
                        <div className="accordion-header accordion-header">
                            <span className="text-container">
                                <div className="button-container">
                                    <div {...provided.dragHandleProps} className="drag-handle-task">
                                        <Header isDragging={snapshot.isDragging}>
                                            ✥
                                        </Header>
                                    </div>
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
                                                className="btn btn-edit btn-sm me-2"
                                                onClick={handleEditClick}
                                            >
                                                ✎
                                            </button>
                                            <button
                                                className="btn btn-delete btn-sm"
                                                onClick={() => onDelete(task.id)}
                                            >
                                                🗑
                                            </button>
                                        </>
                                    )}
                                </div>
                                <button
                                    className="accordion-button collapsed"
                                    type="button"
                                    data-bs-toggle={isEditing ? "" : "collapse"}
                                    data-bs-target={`#collapse-${task.id}`}
                                    aria-expanded="false"
                                    aria-controls={`collapse-${task.id}`}
                                >
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
                                                <label htmlFor="priority-select">Приоритет</label>
                                                <Select
                                                    id="priority-select"
                                                    options={priorityOptions} // Список приоритетов
                                                    value={priorityOptions.find(option => option.value === tempPriority)} // Текущий выбранный приоритет
                                                    onChange={(selectedOption) => setPriority(selectedOption?.value || '')} // Устанавливаем новый приоритет
                                                    placeholder="Выберите приоритет"
                                                    isSearchable={false} // Убираем поиск, так как список короткий
                                                />
                                                <label htmlFor="user-select">Пользователь</label>
                                                <Select
                                                    id="user-select"
                                                    options={userOptions} // Список пользователей
                                                    value={userOptions.find((option) => option.value === tempUser)} // Выбранный пользователь
                                                    onChange={(selectedOption) =>
                                                        setTempUser(selectedOption?.value || "") // Установка нового пользователя
                                                    }
                                                    placeholder="Выберите пользователя"
                                                    isSearchable // Включение поиска
                                                />
                                            </div>
                                        ) : (
                                            <div>
                                                <span>
                                                    <div>
                                                        {task.name}
                                                    </div>
                                                    <div className={getPriorityClass(tempPriority)}>
                                                        {task.priority}
                                                    </div>
                                                    <div className='user-style'>
                                                        <span>{usersData.find((user) => user.id === task.assigneeId)?.name || "Не назначен"}</span>
                                                    </div>
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            </span>
                        </div>
                        <div
                            id={`collapse-${task.id}`}
                            className="accordion-collapse collapse"
                            aria-labelledby={`heading-${task.id}`}
                            data-bs-parent={`#accordion-${task.columnId}`}
                        >
                            <div className="accordion-body">
                                <span className="text-container">
                                    <div>
                                        <span>
                                            {isEditing ? (
                                                <div>
                                                    <label htmlFor="description-textarea">Описание</label>
                                                    <textarea
                                                        id="description-textarea"
                                                        value={tempDescription}
                                                        onChange={(e) => setDescription(e.target.value)}
                                                    ></textarea>
                                                </div>
                                            ) : (
                                                <div className='description-style'>
                                                    {task.description}
                                                </div>
                                            )}
                                        </span>
                                    </div>
                                    <Subtasks data={subtaskData} taskId={task.id} />
                                </span>
                            </div>
                        </div>
                    </div>
                </Container>
            )}
        </Draggable>

    );
};

export default Task;
