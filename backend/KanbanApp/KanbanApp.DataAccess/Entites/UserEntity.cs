using KanbanApp.Core.Model;

namespace KanbanApp.DataAccess.Entites
{
	public class UserEntity
	{
		public Guid Id { get; set; }
		public string Name { get; set; } = string.Empty;
		public string Login { get; set; } = string.Empty;
		public string Password { get; set; } = string.Empty;
		public string Role { get; set; } = string.Empty;
		public List<TaskEntity> AssignedTasks { get; set; } = new List<TaskEntity>();
		public List<BoardUserEntity> BoardUsers { get; set; } = new List<BoardUserEntity>();
	}
}