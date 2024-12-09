namespace KanbanApp.API.Contracts.TasksControllers
{
	// Представляет ответ, содержащий данные о задаче в канбан-доске.
	public record TasksKanbanResponse(
		Guid Id,
		string Name,
		Guid AssigneeId,  // Используем Guid для идентификатора пользователя
		string Priority,
		string Description
	);
}
