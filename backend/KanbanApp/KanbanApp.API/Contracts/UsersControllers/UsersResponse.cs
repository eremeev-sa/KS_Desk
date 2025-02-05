namespace KanbanApp.API.Contracts.UsersControllers
{
	// Представляет ответ, содержащий данные о пользователе в системе канбан.
	public record UsersResponse(
		Guid Id,
		string Name,
		string Login,
		string Role
	);
}