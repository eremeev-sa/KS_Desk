using KanbanApp.API.Contracts.TasksControllers;
using KanbanApp.Application.Services;
using KanbanApp.Core.Model;
using Microsoft.AspNetCore.Mvc;

namespace KanbanApp.API.Controllers
{
	[ApiController]
	[Route("columns/{columnId:guid}/tasks")]
	public class TasksController : ControllerBase
	{
		private readonly ITasksService _tasksService;
		private readonly ISubtasksKanbanService _subtasksService;

		public TasksController(ITasksService tasksService, ISubtasksKanbanService subtasksService)
		{
			_tasksService = tasksService;
			_subtasksService = subtasksService;
		}

		/// <summary>
		/// 
		/// </summary>
		// Метод для получения всех задач канбан-доски
		[HttpGet("all")]
		public async Task<ActionResult<List<TasksKanbanResponse>>> GetTasks()
		{
			var tasks = await _tasksService.GetAllTasksKanban();
			if(tasks == null || !tasks.Any())
			{
				return NotFound("Задачи не найдены");
			}
			var response = tasks.Select(b => new TasksKanbanResponse(
				b.Id,
				b.Name,
				b.AssignedId ?? Guid.Empty, 
				b.Priority,
				b.Description ?? string.Empty
			));
			return Ok(response);
		}

		/// <summary>
		/// Метод для создания новой задачи
		/// </summary>
		[HttpPost("create")]
		public async Task<ActionResult<Guid>> CreateTasks([FromBody] TasksRequest request)
		{
			Guid? assignedId = request.AssignedId == Guid.Empty ? (Guid?)null : request.AssignedId;

			var (task, error) = TaskKanban.Create(
				Guid.NewGuid(),
				request.Name,
				request.Description,
				request.Priority,
				request.ColumnId, 
				assignedId
			);

			if (!string.IsNullOrEmpty(error))
			{
				return BadRequest(error);
			}

			if(task == null)
			{
				return BadRequest("Ошибка при создании задачи");
			}

			var taskId = await _tasksService.CreateTaskKanban(task);
			return Ok(taskId);
		}

		/// <summary>
		/// Метод для обновления существующей задачи
		/// </summary>
		[HttpPut("{id:guid}/update")]
		public async Task<ActionResult<Guid>> UpdateTasks(Guid id, [FromBody] TasksUpdateRequest request)
		{
			var name = request.Name ?? null; 
			var priority = request.Priority ?? null; 
			var description = request.Description ?? null; 
			var assignedId = request.AssignedId ?? null;

			var taskId = await _tasksService.UpdateTaskKanban(
				id,
				name,
				priority,
				description,
				assignedId
			);
			return Ok(taskId);
		}
		
		/// <summary>
		/// Метод для удаления задачи
		/// </summary>
		[HttpDelete("{id:guid}/delete")]
		public async Task<ActionResult<Guid>> DeleteTask(Guid id)
		{
			return Ok(await _tasksService.DeleteTaskKanban(id));
		}

		[HttpGet("{taskId:guid}/subtasks/all")]
		public async Task<ActionResult<List<TaskKanban>>> GetTasksByColumnId(Guid taskId)
		{
			var subtasks = await _subtasksService.GetSubtasksByTaskId(taskId);

			return Ok(subtasks);
		}
		
		/// <summary>
		/// Метод для обновления переноса подзадачи между колонками
		/// </summary>
		[HttpPatch("{id:guid}/column/update")]
		public async Task<ActionResult<Guid>> UpdateTaskColumn(Guid id, [FromBody] Guid columnId)
		{
			if (columnId == Guid.Empty)
			{
				return BadRequest("ColumnId не может быть пустым.");
			}

			var updatedTaskId = await _tasksService.UpdateTaskColumn(id, columnId);

			return Ok(updatedTaskId);
		}
	}
}
