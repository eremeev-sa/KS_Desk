using KanbanApp.Core.Model;
using KanbanApp.DataAccess.Entites;
using Microsoft.EntityFrameworkCore;

namespace KanbanApp.DataAccess.Repositories
{
	public class TaskKanbanRepository : ITasksKanbanRepository
	{
		private readonly KanbanAppDbContext _context;

		public TaskKanbanRepository(KanbanAppDbContext context)
		{
			_context = context;
		}

		// Получение всех задач
		public async Task<List<TaskKanban>> Get()
		{
			// Получаем все задачи без отслеживания изменений
			var taskEntities = await _context.Tasks
				.AsNoTracking()
				.ToListAsync();

			// Преобразуем сущности в модели
			var tasks = taskEntities
				.Select(b => TaskKanban.Create(b.Id, b.Name, b.Description ?? string.Empty, b.Priority, b.ColumnId, b.AssignedUserId).TaskKanban)
				.ToList();

			return tasks;
		}

		// Создание задачи
		public async Task<Guid> Create(TaskKanban taskKanban)
		{
			// Преобразуем модель в сущность для добавления в базу данных
			var taskKanbanEntity = new TaskKanbanEntity
			{
				Id = taskKanban.Id,
				Name = taskKanban.Name,
				Priority = taskKanban.Priority,
				Description = taskKanban.Description,
				ColumnId = taskKanban.ColumnId,
				AssignedUserId = taskKanban.AssignedUserId // Сохраняем идентификатор пользователя
			};

			// Добавляем задачу в таблицу Tasks
			await _context.Tasks.AddAsync(taskKanbanEntity);
			await _context.SaveChangesAsync(); // Сохраняем изменения в базе данных

			return taskKanbanEntity.Id;
		}

		// Обновление задачи
		public async Task<Guid> Update(Guid id, string name, string priority, string description, Guid? assignedUserId, Guid columnId)
		{
			// Обновляем задачу по id
			await _context.Tasks
				.Where(b => b.Id == id)
				.ExecuteUpdateAsync(s => s
					.SetProperty(b => b.Name, b => name)               // Обновляем название задачи
					.SetProperty(b => b.AssignedUserId, b => assignedUserId)  // Обновляем AssignedUserId
					.SetProperty(b => b.Priority, b => priority)       // Обновляем приоритет
					.SetProperty(b => b.Description, b => description) // Обновляем описание
					.SetProperty(b => b.ColumnId, b => columnId) // Обновляем ColumnId
				);

			return id; // Возвращаем обновленный id
		}

		// Удаление задачи
		public async Task<Guid> Delete(Guid id)
		{
			// Удаляем задачу по id
			await _context.Tasks
				.Where(b => b.Id == id)
				.ExecuteDeleteAsync(); // Удаляем задачу из базы данных

			return id; // Возвращаем id удаленной задачи
		}
	}
}
