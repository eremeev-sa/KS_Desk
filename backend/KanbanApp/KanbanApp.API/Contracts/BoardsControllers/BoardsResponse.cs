namespace KanbanApp.API.Contracts.BoardsControllers
{
	// Представляет ответ, содержащий данные о канбан-доске: идентификатор и имя.
	public record BoardsResponse(
		Guid Id, 
		string Name
	);
}