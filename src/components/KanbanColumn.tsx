import React from 'react';
import KanbanTask from './KanbanTask';

type KanbanColumnProps = {
    data: { Id: number; Name: string; Order: number }[];
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({ data }) => {
    return (
        <div className='mt-4'>
            <div className="row">
                {/* Маппинг колонок */}
                {data.map((column) => (
                    <div className="col-12 col-md-3 mb-4" key={column.Order}>
                        <div className="card">
                            <div className="card-header text-center">{column.Name}</div>
                            <div className="card-body">
                                {/* Задачи для колонки */}
                            </div>
                            <KanbanTask onLogout={() => true} />
                        </div>
                    </div>
                ))}

                {/* Кнопка добавления */}
                <div className="col-12 col-md-3 mb-4">
                    <button className="btn btn-secondary w-100">
                        Добавить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default KanbanColumn;
