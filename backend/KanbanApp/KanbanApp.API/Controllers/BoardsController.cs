using KanbanApp.API.Contracts.BoardsControllers;
using KanbanApp.API.Contracts.ColumnsControllers;
using KanbanApp.API.Contracts.UsersControllers;
using KanbanApp.Core.Abstractions.IBoards;
using KanbanApp.Core.Abstractions.IUsers;
using KanbanApp.Core.Model;
using KanbanApp.Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KanbanApp.API.Controllers
{
    [ApiController]
	[Route("boards")]
	public class BoardsController : ControllerBase
	{
		private readonly IBoardsService _boardsService;
		private readonly IColumnsKanbanService _columnsService;
		private readonly IUsersService _usersService;
		
		public BoardsController(IBoardsService boardsService, IColumnsKanbanService columnsService, IUsersService usersService)
		{
			_boardsService = boardsService;
			_columnsService = columnsService;
			_usersService = usersService;
		}

		/// <summary>
		/// Метод для получения всех досок
		/// </summary>
		[HttpGet("all")]
		[Authorize(Roles = "admin")]
		public async Task<ActionResult<List<BoardsResponse>>> GetBoards()
		{
			var boards = await _boardsService.GetAllBoardsKanban();
			var responce = boards.Select(b => new BoardsResponse(b.Id, b.Name));
			return Ok(responce);
		}

		/// <summary>
		/// Метод для создания новой канбан-доски
		/// </summary>
		[HttpPost("create")]
		public async Task<ActionResult<Guid>> CreateBoards([FromBody] BoardsRequest request, [FromQuery] Guid userId)
		{
			(Board board, string error) = Board.Create(
				Guid.NewGuid(),
				request.Name);

			if (!string.IsNullOrEmpty(error))
			{
				return BadRequest(error);
			}

			var boardId = await _boardsService.CreateBoardKanban(board, userId);
			return Ok(boardId);
		}

		/// <summary>
		/// Метод для обновления существующей канбан-доски
		/// </summary>
		[HttpPut("{id:guid}/update")]
		public async Task<ActionResult<Guid>> UpdateBoards(Guid id, [FromBody] BoardsRequest request)
		{
			var boardId = await _boardsService.UpdateBoardKanban(id, request.Name);
			return (boardId);
		}

		/// <summary>
		/// Метод для удаления канбан-доски по ID
		/// </summary>
		[HttpDelete("{id:guid}/delete")]
		public async Task<ActionResult<Guid>> DeleteBoards(Guid id)
		{
			return Ok(await _boardsService.DeleteBoardKanban(id));
		}

		/// <summary>
		/// Метод для получения колонок по ID доски
		/// </summary>
		[HttpGet("/columns/all")]
		public async Task<ActionResult<List<ColumnsKanbanResponse>>> GetColumnsByBoardId(Guid boardId)
		{
			var columns = await _columnsService.GetColumnsByBoardId(boardId);
			var response = columns.Select(c => new ColumnsKanbanResponse(c.Id, c.Name));
			return Ok(response);
		}
		
		/// <summary>
		/// Метод для поиска канбан-доски по ID
		/// </summary>
		[HttpGet("details")]
		public async Task<ActionResult<BoardsResponse>> GetBoardById(Guid id)
		{
			var board = await _boardsService.GetById(id);
			if (board == null)
			{
				return NotFound("Доски не существует!");
			}
			return Ok(new BoardsResponse(board.Id, board.Name));
		}
		
		/// <summary>
		/// Метод для добавления пользователей на доску
		/// </summary>
		[HttpPost("board/users/add")]
		[Authorize(Roles = "admin")]
		public async Task<ActionResult> AddUsersToBoard(Guid boardId, [FromBody] Guid userId)
		{
			var result = await _boardsService.AddUserToBoard(new BoardUser
			{
				BoardId = boardId,
				UserId = userId,
				Role = "user"
			});
			return Ok("Пользователь успешно добавлен!");
		}
		
		/// <summary>
		/// Метод для просмотра пользователей конкретной доски
		/// </summary>
		[HttpGet("{boardId:guid}/users/all")]
		public async Task<ActionResult<List<UsersResponse>>> GetUsersOnBoard(Guid boardId)
		{
			var users = await _boardsService.GetUsersOnBoard(boardId);
			var response = users.Select(u => new UsersResponse(u.Id, u.Name, u.Login, u.Role));
			return Ok(response);
		}
	}
}
