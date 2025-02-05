using KanbanApp.Core.Models;

namespace KanbanApp.Core.Model
{
	public class Board
	{
		public const int MAX_KANBANBOARD_NAME_LENGTH = 30;

		// Список колонок, принадлежащих доске
		public List<Column> Columns { get; private set; }

		private Board(Guid id, string name)
		{
			Id = id;
			Name = name;
			Columns = new List<Column>();
		}

		public Guid Id { get; }
		public string Name { get; } = string.Empty;
		public ICollection<BoardUser> Users { get; set; }

		public static (Board BoardKanban, string Error) Create(Guid id, string name)
		{
			var error = string.Empty;

			if (string.IsNullOrEmpty(name) || name.Length > MAX_KANBANBOARD_NAME_LENGTH)
			{
				error = "Поле не должно быть пустым или не должно превышать 30 символов";
			}

			var board = new Board(id, name);
			return (board, error);
		}
	}
}
