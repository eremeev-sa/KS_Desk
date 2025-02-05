using KanbanApp.DataAccess.Entites;

public class TaskEntity
{
	public Guid Id { get; set; }
	public string Name { get; set; } = string.Empty;
	public string? Description { get; set; }
	public string Priority { get; set; } = string.Empty;
	public Guid ColumnId { get; set; }
	public ColumnEntity? Column { get; set; }
	public Guid? AssignedId { get; set; }  
	public UserEntity? Assigned { get; set; }  
	public List<SubtaskEntity>? Subtasks { get; set; } = new List<SubtaskEntity>();
}
