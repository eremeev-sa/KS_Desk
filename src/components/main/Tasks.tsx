import React from 'react';
import Task from './Task';

type TasksProps = {
    data: {
        Id: string;
        Name: string;
        Assignee: string;
        Priority: number;
        Description: string;
    }[];
    columnId: string;
};

const Tasks: React.FC<TasksProps> = ({ data, columnId }) => {
    return (
        <div className="row">
            <div className="accordion  accordion-flush" id="accordion">
                {data.map((task) => (
                    <div className="accordion-item" key={task.Id}>
                        <Task task={task} columnId={columnId} />
                    </div>
                ))}
            </div>
            <div className="row w-100p mt-2">
                <button className="btn btn-warning w-100">
                    Добавить
                </button>
            </div>
        </div>
    );
};

export default Tasks;
