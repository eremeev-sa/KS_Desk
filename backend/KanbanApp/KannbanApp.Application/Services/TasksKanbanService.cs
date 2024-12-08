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

		public async Task<List<TaskKanban>> GetAllTasksKanban()
		{
			return await _tasksKanbanRepository.Get();
		}

		public async Task<Guid> CreateTaskKanban(TaskKanban taskKanban)
		{
			return await _tasksKanbanRepository.Create(taskKanban);
		}

		public async Task<Guid> UpdateTaskKanban(Guid id, string name, string priority, string description, Guid? assignedUserId, Guid columnId)
		{
			// Обновление задачи с использованием репозитория
			return await _tasksKanbanRepository.Update(id, name, priority, description, assignedUserId, columnId);
		}

		public async Task<Guid> DeleteTaskKanban(Guid id)
		{
			return await _tasksKanbanRepository.Delete(id);
		}
	}
}
