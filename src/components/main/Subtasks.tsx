import React, { useEffect, useState } from 'react';
import { createSubtask, deleteSubtask, getSubtasks } from '../../services/Subtask';
import { SubtaskType } from '../../models/models';
import Subtask from './Subtask';

type SubtaskProps = {
    data: { id: string; name: string }[];
    taskId: string;
};

const Subtasks: React.FC<SubtaskProps> = ({ data, taskId }) => {
    const [addNewSubtask, setAddNewSubtask] = useState(false);
    const [tempSubtaskName, setTempSubtaskName] = useState("");
    const [localSubtasks, setLocalSubtasks] = useState<SubtaskType[]>(data);

    // Слежение за изменениями в tasks и обновление локального состояния
    useEffect(() => {
        setLocalSubtasks(data);
    }, [data]); // Обновляется каждый раз, когда tasks изменяется

    const handleTaskLocalUpdate = async () => {
        // Получаем обновленные подзадачи
        const updatedSubasks = await getSubtasks(taskId);

        // Обновляем локальные данные подзадач
        setLocalSubtasks(updatedSubasks);
    };

    // Функция для добавления новой задачи
    const handleAddClick = async () => {
        try {
            const newTask = {
                name: tempSubtaskName,
                taskId: taskId
            };
            // Создаем новую подзадачу
            await createSubtask(newTask);

            handleTaskLocalUpdate();
            // Очищаем поле ввода
            setTempSubtaskName("");

            // Закрываем форму добавления
            setAddNewSubtask(false);
        } catch (error) {
            console.error("Ошибка при добавлении подзадачи:", error);
        }
    };

    const handleDelete = async (id: string) => {
        console.log("Удаление доски с id:", id);
        try {
            await deleteSubtask(id);

            // Получаем обновленные подзадачи
            const updatedSubasks = await getSubtasks(taskId);

            // Обновляем локальные данные подзадач
            setLocalSubtasks(updatedSubasks);

        } catch (error) {
            console.error("Ошибка при удалении доски:", error);
        }
    };

    const handleCancelClick = () => {
        setTempSubtaskName("");
        setAddNewSubtask(false);
    };
    return (
        <div className="row">
            <ul className="list-group h-100p">
                {localSubtasks.map((subtask) => (
                    <li className="list-group-item" key={subtask.id}>
                        <Subtask
                            id={subtask.id}
                            name={subtask.name}
                            onDelete={handleDelete}
                            onUpdate={handleTaskLocalUpdate}
                        />
                    </li>
                ))}
            </ul>
            {addNewSubtask ? (
                <div className="row mt-2">
                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Название подзадачи"
                        value={tempSubtaskName}
                        onChange={(e) => setTempSubtaskName(e.target.value)}
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
                        className="btn btn-add w-100 me-2 bth-add-subtask center"
                        onClick={() => setAddNewSubtask(true)}>
                        +
                        <div className='text-on-bth'>
                            Добавить подзадачу
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
};

export default Subtasks;
