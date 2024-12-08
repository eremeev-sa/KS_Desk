namespace KanbanApp.API.Contracts.TasksControllers
{
	public record TasksKanbanRequest(
		string Name,
		string Description,
		string Priority,
		Guid ColumnId,  // Добавляем ColumnId
		Guid AssigneeId // Используем Guid для идентификатора пользователя
	);
}
