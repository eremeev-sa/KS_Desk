export type BoardType = {
    id: string;
    name: string;
    ownerId: string | undefined;
}

export type ColumnType = {
    id: string;
    name: string;
    order: number;
}

export type SubtaskType = {
    id: string;
    name: string;
    description: string;
    priority: number;
    endDate: Date;
    assignedId: string | null;
    taskId: string;
    order: number;
};

export type TaskType = {
    id: string;
    name: string;
    description: string;
    priority: number;
    columnId: string;
    assignedId: string | null;
    order: number;
};

export type UserType = {
    id: string;
    name: string;
    login: string;
    password: string;
};
