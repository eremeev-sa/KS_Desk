using KanbanApp.API.Contracts.TasksControllers;
using KanbanApp.Core.Model;
using Microsoft.AspNetCore.Mvc;

namespace KanbanApp.API.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class TasksKanbanController : ControllerBase
	{
		private readonly ITasksKanbanService _tasksService;

		public TasksKanbanController(ITasksKanbanService tasksService)
		{
			_tasksService = tasksService;
		}

		// Метод для получения всех задач канбан-доски
		[HttpGet]
		public async Task<ActionResult<List<TasksKanbanResponse>>> GetTasks()
		{
			var tasks = await _tasksService.GetAllTasksKanban();
			var response = tasks.Select(b => new TasksKanbanResponse(
				b.Id,
				b.Name,
				b.AssignedUserId ?? Guid.Empty, 
				b.Priority,
				b.Description ?? string.Empty
			));
			return Ok(response);
		}

		// Метод для создания новой задачи
		[HttpPost]
		public async Task<ActionResult<Guid>> CreateTasks([FromBody] TasksKanbanRequest request)
		{
			Guid? assignedUserId = request.AssigneeId == Guid.Empty ? (Guid?)null : request.AssigneeId;

			(TaskKanban task, string error) = TaskKanban.Create(
				Guid.NewGuid(),
				request.Name,
				request.Description,
				request.Priority,
				request.ColumnId, 
				assignedUserId
			);

			if (!string.IsNullOrEmpty(error))
			{
				return BadRequest(error);
			}

			var taskId = await _tasksService.CreateTaskKanban(task);
			return Ok(taskId);
		}

		// Метод для обновления существующей задачи
		[HttpPut("{id:guid}")]
		public async Task<ActionResult<Guid>> UpdateTasks(Guid id, [FromBody] TasksKanbanRequest request)
		{
			Guid? assignedUserId = request.AssigneeId == Guid.Empty ? (Guid?)null : request.AssigneeId;

			var taskId = await _tasksService.UpdateTaskKanban(
				id,
				request.Name,
				request.Priority,
				request.Description,
				assignedUserId,
				request.ColumnId  
			);
			return Ok(taskId);
		}

		// Метод для удаления задачи
		[HttpDelete("{id:guid}")]
		public async Task<ActionResult<Guid>> DeleteTask(Guid id)
		{
			return Ok(await _tasksService.DeleteTaskKanban(id));
		}
	}
}
