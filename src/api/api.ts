// src/api/api.ts

const BASE_URL = "http://localhost:5000"; // URL вашего бэкенда

// Функция для получения списка досок
export const getBoards = async () => {
  try {
    const response = await fetch(`${BASE_URL}/boards`);
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

// Функция для получения данных по колонкам
export const getColumns = async () => {
  try {
    const response = await fetch(`${BASE_URL}/columns`);
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
