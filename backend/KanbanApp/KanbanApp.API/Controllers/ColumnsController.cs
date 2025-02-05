using KanbanApp.API.Contracts.ColumnsControllers;
using KanbanApp.Application.Services;
using KanbanApp.Core.Abstractions.IBoards;
using KanbanApp.Core.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KanbanApp.API.Controllers
{
    [ApiController]
	[Route("boards/{boardId:guid}/columns")]
	public class ColumnsController : ControllerBase
	{
		private readonly IColumnsKanbanService _columnsService;
		private readonly IBoardsService _boardService; // Для проверки доски
		private readonly ITasksService _tasksService;

		public ColumnsController(IColumnsKanbanService columnsService, IBoardsService boardService, ITasksService tasksService)
		{
			_columnsService = columnsService;
			_boardService = boardService;
			_tasksService = tasksService;
		}

		// Метод для получения всех колонок канбан-досок
		[HttpGet("all")]
		public async Task<ActionResult<List<ColumnsKanbanResponse>>> GetColumns()
		{
			var columns = await _columnsService.GetAllColumnsKanban();
			var response = columns.Select(b => new ColumnsKanbanResponse(b.Id, b.Name));
			return Ok(response);
		}

		// Метод для создания новой колонки в канбан-доске
		[HttpPost("create")]
		public async Task<ActionResult<Guid>> CreateColumns([FromBody] ColumnsRequest request)
		{
			var columns = await _columnsService.GetColumnsByBoardId(request.BoardId);
			int maxOrder = columns.Any() ? columns.Max(c => c.Order) : 0;

			int newOrder = maxOrder + 1;

			(Column column, string error) = Column.Create(
				Guid.NewGuid(),
				request.Name,
				request.BoardId,
				newOrder 
			);

			if (!string.IsNullOrEmpty(error))
			{
				return BadRequest(error);
			}

			var columnId = await _columnsService.CreateColumnKanban(column);
			return Ok(columnId);
		}

		// Метод для обновления существующей колонки
		[HttpPut("{id:guid}/update")]
		public async Task<ActionResult<Guid>> UpdateColumns(Guid id, [FromBody] ColumnsRequest request)
		{
			int order = 0; 
			var columnId = await _columnsService.UpdateColumnKanban(id, request.Name, order);
			return Ok(columnId);
		}

		// Метод для удаления колонки
		[HttpDelete("{id:guid}/delete")]
		public async Task<ActionResult<Guid>> DeleteColumns(Guid id)
		{
			return Ok(await _columnsService.DeleteColumnKanban(id));
		}

		// Метод для обновления порядка колонок
		[HttpPut("order")]
		public async Task<ActionResult> UpdateColumnsOrder([FromBody] UpdateColumnsOrderRequest request)
		{
			await _columnsService.UpdateColumnsOrder(request.OrderedColumnIds);
			return Ok();
		}

		[HttpGet("{columnId:guid}/tasks/all")]
		public async Task<ActionResult<List<TaskKanban>>> GetTasksByColumnId(Guid columnId)
		{
			var tasks = await _tasksService.GetTasksByColumnId(columnId);

			return Ok(tasks);
		}
	}
}
