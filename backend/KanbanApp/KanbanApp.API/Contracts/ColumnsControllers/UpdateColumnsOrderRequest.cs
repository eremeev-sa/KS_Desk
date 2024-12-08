namespace KanbanApp.API.Contracts.ColumnsControllers
{
	public record UpdateColumnsOrderRequest(
		List<Guid> OrderedColumnIds
	);
}
