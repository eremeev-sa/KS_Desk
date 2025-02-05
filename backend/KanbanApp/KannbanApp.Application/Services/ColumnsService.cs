using KanbanApp.Core.Model;

public class ColumnsService : IColumnsKanbanService
{
	private readonly IColumnsRepository _columnsRepository;

	public ColumnsService(IColumnsRepository columnsRepository)
	{
		_columnsRepository = columnsRepository;
	}

	// Метод для получения всех колонок канбан-досок
	public async Task<List<Column>> GetAllColumnsKanban()
	{
		return await _columnsRepository.Get();
	}

	// Метод для создания новой колонки в канбан-доске
	public async Task<Guid> CreateColumnKanban(Column column)
	{
		return await _columnsRepository.Create(column);
	}

	// Метод для обновления существующей колонки в канбан-доске
	public async Task<Guid> UpdateColumnKanban(Guid id, string name, int order)
	{
		return await _columnsRepository.Update(id, name, order);
	}

	// Метод для удаления колонки по ID
	public async Task<Guid> DeleteColumnKanban(Guid id)
	{
		return await _columnsRepository.Delete(id);
	}

	// Метод для обновления порядка колонок
	public async Task UpdateColumnsOrder(List<Guid> orderedColumnIds)
	{
		await _columnsRepository.UpdateOrder(orderedColumnIds);
	}

	// Метод для получения колонок по ID доски
	public async Task<List<Column>> GetColumnsByBoardId(Guid boardId)
	{
		return await _columnsRepository.GetByBoardId(boardId);
	}
}
