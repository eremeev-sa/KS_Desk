using KanbanApp.Core.Model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IColumnsKanbanRepository
{
	Task<List<ColumnKanban>> Get();
	Task<Guid> Create(ColumnKanban column);
	Task<Guid> Update(Guid id, string name, int order);
	Task<Guid> Delete(Guid id);
	Task UpdateOrder(List<Guid> orderedColumnIds);
	Task<List<ColumnKanban>> GetByBoardId(Guid boardId);
}
