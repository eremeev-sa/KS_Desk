using KanbanApp.Core.Model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IColumnsKanbanRepository
{
	Task<List<ColumnKanban>> Get();
	Task<Guid> Create(ColumnKanban column);
	Task<Guid> Update(Guid id, string name, int order);  // Обновленный метод для получения 3 параметров
	Task<Guid> Delete(Guid id);

	// Метод для обновления порядка колонок
	Task UpdateOrder(List<Guid> orderedColumnIds);

	// Метод для получения колонок по boardId
	Task<List<ColumnKanban>> GetByBoardId(Guid boardId);
}
