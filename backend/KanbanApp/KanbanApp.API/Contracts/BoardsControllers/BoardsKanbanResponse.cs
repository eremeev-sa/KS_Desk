namespace KanbanApp.API.Contracts.BoardsControllers
{
	public record BoardsKanbanResponse(
		Guid Id,
		string Name
	);
}