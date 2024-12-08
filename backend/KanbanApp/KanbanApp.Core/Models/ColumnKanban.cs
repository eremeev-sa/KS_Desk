namespace KanbanApp.Core.Model
{
	public class ColumnKanban
	{
		public const int MAX_KANBANCOLUMN_NAME_LENGTH = 30;
		public List<TaskKanban> Tasks { get; set; }
		public int Order { get; private set; } // Новое поле для порядка колонок

		private ColumnKanban(Guid id, string name, int order)
		{
			Id = id;
			Name = name;
			Order = order;
			Tasks = new List<TaskKanban>();
		}

		public Guid Id { get; }
		public string Name { get; } = string.Empty;

		public static (ColumnKanban ColumnKanban, string Error) Create(Guid id, string name, int order)
		{
			var error = string.Empty;

			if (string.IsNullOrEmpty(name) || name.Length > MAX_KANBANCOLUMN_NAME_LENGTH)
			{
				error = "Поле не должно быть пустым или не должно превышать 30 символов";
			}

			var column = new ColumnKanban(id, name, order);
			return (column, error);
		}
	}
}
