using KanbanApp.Core.Models;

public interface ISubtasksKanbanService
{
	// Метод для создания новой задачи
	Task<Guid> CreateSubtaskKanban(Subtask subtask);

	// Метод для обновления задачи
	Task<Guid> UpdateSubtaskKanban(Guid id, string name);

	// Метод для удаления задачи по
	Task<Guid> DeleteSubtaskKanban(Guid id);

	// Метод для получения всех задач
	Task<List<Subtask>> GetAllSubtasksKanban();

	// Метод для получения задач по колонке
	Task<List<Subtask>> GetSubtasksByTaskId(Guid taskId);
}
