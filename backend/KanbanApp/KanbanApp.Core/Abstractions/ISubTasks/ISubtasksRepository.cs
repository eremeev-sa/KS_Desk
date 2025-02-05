using KanbanApp.Core.Models;

public interface ISubtasksRepository
{
	// Получение всех подзадач
	Task<List<Subtask>> Get();

	// Создание подзадачи
	Task<Guid> Create(Subtask subtask);

	// Обновление подзадачи
	Task<Guid> Update(Guid id, string name);

	// Удаление подзадачи
	Task<Guid> Delete(Guid id);

	// Получение подзадач по TaskId
	Task<List<Subtask>> GetByTaskId(Guid taskId);
}
