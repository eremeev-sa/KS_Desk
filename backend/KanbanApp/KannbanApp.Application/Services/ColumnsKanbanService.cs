using KanbanApp.Core.Model;

public class ColumnsKanbanService : IColumnsKanbanService
{
	private readonly IColumnsKanbanRepository _columnsKanbanRepository;

	public ColumnsKanbanService(IColumnsKanbanRepository columnsKanbanRepository)
	{
		_columnsKanbanRepository = columnsKanbanRepository;
	}

	public async Task<List<ColumnKanban>> GetAllColumnsKanban()
	{
		return await _columnsKanbanRepository.Get();
	}

	public async Task<Guid> CreateColumnKanban(ColumnKanban columnKanban)
	{
		return await _columnsKanbanRepository.Create(columnKanban);
	}

	public async Task<Guid> UpdateColumnKanban(Guid id, string name, int order)
	{
		return await _columnsKanbanRepository.Update(id, name, order);
	}

	public async Task<Guid> DeleteColumnKanban(Guid id)
	{
		return await _columnsKanbanRepository.Delete(id);
	}

	public async Task UpdateColumnsOrder(List<Guid> orderedColumnIds)
	{
		await _columnsKanbanRepository.UpdateOrder(orderedColumnIds);
	}

	public async Task<List<ColumnKanban>> GetColumnsByBoardId(Guid boardId)
	{
		return await _columnsKanbanRepository.GetByBoardId(boardId);
	}
}
