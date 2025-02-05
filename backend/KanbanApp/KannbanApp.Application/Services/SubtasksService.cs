using KanbanApp.Core.Model;
using KanbanApp.Core.Models;

namespace KanbanApp.Application.Services
{
	public class SubtasksService : ISubtasksKanbanService
	{
		private readonly ISubtasksRepository _subtaskRepository;

		public SubtasksService(ISubtasksRepository subtaskRepository)
		{
			_subtaskRepository = subtaskRepository;
		}

		// Получение всех подзадач для конкретной задачи
		public async Task<List<Subtask>> GetAllSubtasksKanban()
		{
			return await _subtaskRepository.Get();
		}

		// Создание новой подзадачи
		public async Task<Guid> CreateSubtaskKanban(Subtask subtask)
		{
			return await _subtaskRepository.Create(subtask);
		}

		// Обновление подзадачизадачи
		public async Task<Guid> UpdateSubtaskKanban(Guid id, string name)
		{
			return await _subtaskRepository.Update(id, name);
		}

		// Удаление подзадачи
		public async Task<Guid> DeleteSubtaskKanban(Guid id)
		{
			return await _subtaskRepository.Delete(id);
		}

		// Получение подзадач по задаче
		public async Task<List<Subtask>> GetSubtasksByTaskId(Guid taskId)
		{
			return await _subtaskRepository.GetByTaskId(taskId);  // Вызов метода репозитория
		}
	}
}
