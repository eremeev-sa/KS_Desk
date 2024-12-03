import React from 'react';

type KanbanBoardProps = {
  onLogout: () => void;
  data: { Id: number; Name: string }[];
};


const KanbanBoard: React.FC<KanbanBoardProps> = ({ onLogout, data }) => {
  return (
    <div className='m-4'>
      <div className="row">
        <h2>Kanban</h2>
      </div>
      <div className="row">
        <button className="btn btn-danger" onClick={onLogout}>
          Выйти
        </button>
      </div>
      <div className="list-group mt-4">
        {data.map((project) => (
          <a
            key={project.Id}
            href="#"
            className="list-group-item list-group-item-action"
            aria-current="true"
          >
            {project.Name}
          </a>
        ))}
      </div>

    </div>
  );
};

export default KanbanBoard;
