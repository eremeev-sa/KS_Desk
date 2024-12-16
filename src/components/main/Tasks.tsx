import React, { useEffect, useState } from 'react';
import Task from './Task';
import { Droppable } from 'react-beautiful-dnd';
import { createTask, deleteTask, getTasks, TaskRequest, TaskUpdateRequest, updateTask, updateTaskColumn } from '../../services/Task';
import { TaskType, UserType } from '../../models/models';
import { getUsers } from '../../services/User';

type TasksProps = {
    tasks: {
        id: string;
        name: string;
        description: string;
        priority: string;
        columnId: string;
        assigneeId: string;
    }[];
    columnId: string;

    handleTaskUpdate: (id: string, taskRequest: TaskUpdateRequest) => void;
    handleTaskLocalUpdate: () => void;
};

const Tasks: React.FC<TasksProps> = ({ tasks, columnId, handleTaskUpdate, handleTaskLocalUpdate }) => {
    const [addNewTask, setAddNewTask] = useState(false);
    const [tempTaskName, setTempTaskName] = useState("");
    const [localTasks, setLocalTasks] = useState<TaskType[]>(tasks);
    const [usersData, setUsersData] = useState<UserType[]>([]);

    // Слежение за изменениями в tasks и обновление локального состояния
    useEffect(() => {
        setLocalTasks(tasks);
    }, [tasks]); // Обновляется каждый раз, когда tasks изменяется

    // Обновление локального состояния
    useEffect(() => {
        const fetchColumns = async () => {
            const users = await getUsers();
            setUsersData(users);
        }
        fetchColumns();
    }, []);

    // Функция для добавления новой задачи
    const handleAddClick = async () => {
        try {
            const newTask = {
                name: tempTaskName,
                description: "",
                priority: "",
                columnId: columnId,
            };
            // Создаем новую задачу
            await createTask(newTask);

            handleTaskLocalUpdate();

            // Очищаем поле ввода
            setTempTaskName("");

            // Закрываем форму добавления
            setAddNewTask(false);
        } catch (error) {
            console.error("Ошибка при добавлении задачи:", error);
        }
    };

    const handleDelete = async (id: string) => {
        console.log("Удаление доски с id:", id);
        try {
            await deleteTask(id);

            handleTaskLocalUpdate();

        } catch (error) {
            console.error("Ошибка при удалении доски:", error);
        }
    };

    const handleCancelClick = () => {
        setTempTaskName("");
        setAddNewTask(false);
    };

    return (
        <div className="row">
            <div className="accordion accordion-flush" id="accordion">
                <Droppable
                    droppableId={columnId}
                    type="TASK"
                    direction="vertical"
                    isCombineEnabled={false}
                >
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                minHeight: "100px", // минимальная высота для визуализации
                            }}
                        >
                            {localTasks.length === 0 ? (
                                <div style={{ textAlign: "center", padding: "10px" }}>
                                    Задач нет
                                </div>
                            ) : (
                                localTasks.map((task, index) => (
                                    <div className="accordion-item" key={task.id}>
                                        <Task
                                            key={task.id}
                                            {...task}
                                            index={index}
                                            task={task}
                                            onDelete={handleDelete}
                                            handleTaskUpdate={handleTaskUpdate}
                                            usersData={usersData}
                                        />
                                    </div>
                                ))
                            )}
                            {provided.placeholder} {/* Добавляем пустое место для перетаскивания */}
                        </div>
                    )}
                </Droppable>

            </div>

            {addNewTask ? (
                <div className="row mt-2">
                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Название задачи"
                        value={tempTaskName}
                        onChange={(e) => setTempTaskName(e.target.value)}
                    />
                    <div className="d-flex justify-content-between">
                        <button
                            className="btn btn-success"
                            onClick={handleAddClick}
                        >
                            ✔
                        </button>
                        <button
                            className="btn btn-danger"
                            onClick={handleCancelClick}
                        >
                            ✖
                        </button>
                    </div>
                </div>
            ) : (
                <div className="row w-100 mt-2 center">
                    <button
                        className="btn btn-warning w-100"
                        onClick={() => setAddNewTask(true)}
                    >
                        Добавить
                    </button>
                </div>
            )}
        </div>
    );
};


export default Tasks;
