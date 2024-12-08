namespace KanbanApp.DataAccess.Entites
{
	public class ColumnKanbanEntity
	{
		public Guid Id { get; set; }
		public string Name { get; set; } = string.Empty;
		public int Order { get; set; } // Поле для порядка колонок

		public Guid BoardId { get; set; }
		public BoardKanbanEntity? Board { get; set; } // Связь с доской
		public List<TaskKanbanEntity> Tasks { get; set; } = new List<TaskKanbanEntity>();
	}
}
