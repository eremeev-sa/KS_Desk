using KanbanApp.DataAccess.Entites;

public class TaskKanbanEntity
{
	public Guid Id { get; set; }
	public string Name { get; set; } = string.Empty;
	public string? Assignee { get; set; }
	public string? Description { get; set; }
	public string Priority { get; set; } = string.Empty;

	public Guid ColumnId { get; set; }
	public ColumnKanbanEntity? Column { get; set; }

	public Guid? AssignedUserId { get; set; }  // Это поле хранит идентификатор пользователя
	public UserKanbanEntity? AssignedUser { get; set; }  // Связь с пользователем
}
