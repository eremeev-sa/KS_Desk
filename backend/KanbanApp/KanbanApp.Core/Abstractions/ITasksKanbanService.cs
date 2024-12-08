using KanbanApp.Core.Model;

public interface ITasksKanbanService
{
	Task<Guid> CreateTaskKanban(TaskKanban taskKanban);  // Создание задачи

	Task<Guid> UpdateTaskKanban(Guid id, string name, string priority, string description, Guid? assignedUserId, Guid columnId);  // Обновление задачи с учетом assignedUserId и ColumnId

	Task<Guid> DeleteTaskKanban(Guid id);  // Удаление задачи

	Task<List<TaskKanban>> GetAllTasksKanban();  // Получение всех задач
}