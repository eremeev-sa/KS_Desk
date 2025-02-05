using KanbanApp.Core.Model;

namespace KanbanApp.Application.Services
{
	public class TasksService : ITasksService
	{
		private readonly ITasksRepository _tasksRepository;

		public TasksService(ITasksRepository tasksRepository)
		{
			_tasksRepository = tasksRepository;
		}

		// Получение всех задач канбан-доски
		public async Task<List<TaskKanban>> GetAllTasksKanban()
		{
			return await _tasksRepository.Get();
		}

		// Создание новой задачи
		public async Task<Guid> CreateTaskKanban(TaskKanban taskKanban)
		{
			return await _tasksRepository.Create(taskKanban);
		}

		// Обновление задачи
		public async Task<Guid> UpdateTaskKanban(Guid id, string? name, string? priority, string? description, Guid? assignedId)
		{
			var upTask = await _tasksRepository.GetByIdTask(id); // Получаем текущую задачу

			if (upTask == null)
			{
				throw new KeyNotFoundException($"Задача с ID {id} не найдена.");
			}
			var upName = name ?? upTask.Name;
			var upPriority = priority ?? upTask.Priority;
			var upDescription = description ?? upTask.Description;
			var upAssignedId = assignedId.HasValue ? assignedId : upTask.AssignedId;
			
			return await _tasksRepository.Update(id, upName, upPriority, upDescription, upAssignedId);
		}

		// Удаление задачи
		public async Task<Guid> DeleteTaskKanban(Guid id)
		{
			return await _tasksRepository.Delete(id);
		}

		// Получение задач по колонке
		public async Task<List<TaskKanban>> GetTasksByColumnId(Guid columnId)
		{
			return await _tasksRepository.GetByColumnId(columnId);
		}

		public async Task<Guid> UpdateTaskColumn(Guid id, Guid columnId)
		{
			return await _tasksRepository.UpdateTaskColumn(id, columnId);
		}
	}
}
