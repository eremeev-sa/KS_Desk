namespace KanbanApp.API.Contracts.SubtasksControllers
{
	public record SubtasksRequest(
		string Name,
		Guid TaskId
	);
}
