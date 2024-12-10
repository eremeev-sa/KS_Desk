import { BASE_URL } from './config';

export interface TaskRequest {
    Name: string;
    Assignee: string;
    //Priority: number;
    Priority: number;
    Description: string;
};

const CURRENT_URL = `${BASE_URL}/TasksKanban`;

// Функция для получения списка задач
export const getTasks = async () => {
    try {
        const response = await fetch(`${CURRENT_URL}`);
        if (!response.ok) {
            throw new Error("Не удалось получить данные с бэкенда");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
};

// Функция для создания задачи
export const createTask = async (taskRequest: TaskRequest) => {
    await fetch(`${CURRENT_URL}`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(taskRequest),
    });
};

// Функция для изменения задачи
export const updateTask = async (id: string, taskRequest: TaskRequest) => {
    await fetch(`${CURRENT_URL}/${id}`, {
        method: "PUT",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(taskRequest),
    });
};

// Функция для удаления задачи
export const deleteTask = async (id: string) => {
    await fetch(`${CURRENT_URL}/${id}`, {
        method: "DELETE",
    });
};