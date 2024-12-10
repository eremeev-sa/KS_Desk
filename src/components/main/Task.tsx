import React from 'react';
import Subtasks from './Subtasks';

type TaskProps = {
    task: {
        Id: string;
        Name: string;
        Assignee: string;
        Priority: number;
        Description: string;
    };
    columnId: string;
};

const SubtaskData = [
    { Id: "1", Name: "Subtask1" },
    { Id: "2", Name: "Subtask2" },
    { Id: "3", Name: "Subtask3" },
    { Id: "4", Name: "Subtask4" }
]

const Task: React.FC<TaskProps> = ({ task, columnId }) => {
    return (
        <div className="accordion-item">
            <h2 className="accordion-header" id={`heading-${task.Id}-${columnId}`}>
                <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse-${task.Id}-${columnId}`}
                    aria-expanded="false"
                    aria-controls={`collapse-${task.Id}-${columnId}`}
                >
                    {task.Name}
                </button>
            </h2>
            <div
                id={`collapse-${task.Id}-${columnId}`}
                className="accordion-collapse collapse"
                aria-labelledby={`heading-${task.Id}-${columnId}`}
                data-bs-parent={`#accordion-${columnId}`}
            >
                <div className="accordion-body">
                    <Subtasks data={SubtaskData} taskId={task.Id} />
                </div>
            </div>
        </div>
    );
};

export default Task;
