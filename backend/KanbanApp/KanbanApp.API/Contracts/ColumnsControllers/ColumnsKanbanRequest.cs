namespace KanbanApp.API.Contracts.ColumnsControllers
{
	public record ColumnsKanbanRequest(
		string Name,
		Guid BoardId // Привязка к доске
	);

}