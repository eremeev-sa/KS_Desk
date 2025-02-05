namespace KanbanApp.DataAccess.Entites
{
	public class BoardEntity
	{
		public Guid Id { get; set; }
		public string Name { get; set; } = string.Empty;
		public Guid OwnerId { get; set; }
		public List<ColumnEntity> Columns { get; set; } = new List<ColumnEntity>();
		public List<BoardUserEntity> BoardUsers { get; set; } = new List<BoardUserEntity>();
	}
}
