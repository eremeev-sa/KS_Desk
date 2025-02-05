namespace KanbanApp.DataAccess.Entites
{
	public class ColumnEntity
	{
		public Guid Id { get; set; }
		public string Name { get; set; } = string.Empty;
		public int Order { get; set; } 
		public Guid BoardId { get; set; }
		public BoardEntity? Board { get; set; } 
		public List<TaskEntity> Tasks { get; set; } = new List<TaskEntity>();
	}
}
