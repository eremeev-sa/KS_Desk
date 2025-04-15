import { BASE_URL } from './config';

export interface BoardRequest {
    name: string;
    ownerId: string | undefined;
};

export interface UpdateBoardRequest {
    name: string;
};

const CURRENT_URL = `${BASE_URL}/Boards`;

// Функция для получения списка досок
export const getBoards = async () => {
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

// Функция для создания доски
export const createBoard = async (boardRequest: BoardRequest) => {
    await fetch(`${CURRENT_URL}`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(boardRequest),
    });
};

// Функция для изменения доски
export const updateBoard = async (id: string, boardRequest: UpdateBoardRequest) => {
    await fetch(`${CURRENT_URL}/${id}`, {
        method: "PUT",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(boardRequest),
    });
};

// Функция для удаления доски
export const deleteBoard = async (id: string) => {
    await fetch(`${CURRENT_URL}/${id}`, {
        method: "DELETE",
    });
};