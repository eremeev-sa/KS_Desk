import React from 'react';

type SubtaskProps = {
    data: { Id: string; Name: string; }[];
};

const Subtask: React.FC<SubtaskProps> = ({ data }) => {
    return (
        <div className=''>
            <div className="row">
                <ul className="list-group h-100p">
                    {data.map((subtask) => (
                        <li className="list-group-item">{subtask.Name}</li>
                    ))}
                </ul>

                <div className="row w-100p mt-2">
                    <button className="btn btn-secondary w-100">
                        Добавить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Subtask;
