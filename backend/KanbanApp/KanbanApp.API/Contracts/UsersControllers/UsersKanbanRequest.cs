namespace KanbanApp.API.Contracts.UsersControllers
{
	public record UsersKanbanRequest(
		string Name,
		string Login,
		string Password
	);
}