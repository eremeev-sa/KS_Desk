public class SubtaskEntity
{
	public Guid Id { get; set; }
	public string Name { get; set; } = string.Empty;
	public Guid TaskId { get; set; }
	public TaskEntity? Task { get; set; }

}