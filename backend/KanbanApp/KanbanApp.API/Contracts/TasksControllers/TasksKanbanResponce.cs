namespace KanbanApp.API.Contracts.TasksControllers
{
	public record TasksKanbanResponse(
		Guid Id,
		string Name,
		Guid AssigneeId,  // Используем Guid для идентификатора пользователя
		string Priority,
		string Description
	);
}
