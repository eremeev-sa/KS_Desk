using KanbanApp.Core.Model;

namespace KanbanApp.Application.Services
{
	public class TasksKanbanService : ITasksKanbanService
	{
		private readonly ITasksKanbanRepository _tasksKanbanRepository;

		public TasksKanbanService(ITasksKanbanRepository tasksKanbanRepository)
		{
			_tasksKanbanRepository = tasksKanbanRepository;
		}

		// Получение всех задач канбан-доски
		public async Task<List<TaskKanban>> GetAllTasksKanban()
		{
			return await _tasksKanbanRepository.Get();
		}

		// Создание новой задачи
		public async Task<Guid> CreateTaskKanban(TaskKanban taskKanban)
		{
			return await _tasksKanbanRepository.Create(taskKanban);
		}

		// Обновление задачи
		public async Task<Guid> UpdateTaskKanban(Guid id, string name, string priority, string description, Guid? assignedUserId, Guid columnId)
		{
			return await _tasksKanbanRepository.Update(id, name, priority, description, assignedUserId, columnId);
		}

		// Удаление задачи
		public async Task<Guid> DeleteTaskKanban(Guid id)
		{
			return await _tasksKanbanRepository.Delete(id);
		}

		// Получение задач по колонке
		public async Task<List<TaskKanban>> GetTasksByColumnId(Guid columnId)
		{
			return await _tasksKanbanRepository.GetByColumnId(columnId);  // Вызов метода репозитория
		}
	}
}
