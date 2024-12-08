using KanbanApp.Core.Model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IColumnsKanbanService
{
	Task<List<ColumnKanban>> GetAllColumnsKanban();
	Task<Guid> CreateColumnKanban(ColumnKanban columnKanban);
	Task<Guid> UpdateColumnKanban(Guid id, string name, int order);
	Task<Guid> DeleteColumnKanban(Guid id);
	Task UpdateColumnsOrder(List<Guid> orderedColumnIds);
	Task<List<ColumnKanban>> GetColumnsByBoardId(Guid boardId);
}
