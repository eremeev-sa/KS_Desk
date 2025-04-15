import { BASE_URL } from './config';

export interface ColumnRequest {
    name: string;
};

export interface CreateColumnRequest {
    name: string;
    boardId: string;
};

export interface UpdateColumnOrderRequest {
    order: number;
};

const CURRENT_URL = `${BASE_URL}/columns`;

// Функция для получения списка колонок
export const getColumns = async (boardid: string) => {
    try {
        const response = await fetch(`${BASE_URL}/boards/${boardid}`);
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

// Функция для создания колонки
export const createColumn = async (columnRequest: CreateColumnRequest) => {
    await fetch(`${CURRENT_URL}`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(columnRequest),
    });
};

// Функция для изменения колонки
export const updateColumn = async (id: string, columnRequest: ColumnRequest) => {
    await fetch(`${CURRENT_URL}/${id}/name`, {
        method: "PATCH",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(columnRequest),
    });
};

// Функция для изменения последовательностей колонок
export const updateColumnOrder = async (id: string, columnRequest: UpdateColumnOrderRequest) => {
    await fetch(`${CURRENT_URL}/${id}/order`, {
        method: "PATCH",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(columnRequest),
    });
};



// Функция для удаления колонки
export const deleteColumn = async (id: string) => {
    await fetch(`${CURRENT_URL}/${id}`, {
        method: "DELETE",
    });
};