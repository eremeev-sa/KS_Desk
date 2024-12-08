﻿using KanbanApp.API.Contracts.BoardsControllers;
using KanbanApp.API.Contracts.ColumnsControllers;
using KanbanApp.Application.Services;
using KanbanApp.Core.Abstractions;
using KanbanApp.Core.Model;
using Microsoft.AspNetCore.Mvc;

namespace KanbanApp.API.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class BoardsKanabanController : ControllerBase
	{
		private readonly IBoardsKanbanService _boardsService;
		private readonly IColumnsKanbanService _columnsService;

		public BoardsKanabanController(IBoardsKanbanService boardsService, IColumnsKanbanService columnsService)
		{
			_boardsService = boardsService;
			_columnsService = columnsService;
		}

		[HttpGet]
		public async Task<ActionResult<List<BoardsKanbanResponse>>> GetBoards()
		{
			var boards = await _boardsService.GetAllBoardsKanban();
			var responce = boards.Select(b => new BoardsKanbanResponse(b.Id, b.Name));
			return Ok(responce);
		}

		[HttpPost]
		public async Task<ActionResult<Guid>> CreateBoards([FromBody] BoardsKanbanRequest request)
		{
			(BoardKanban board, string error) = BoardKanban.Create(
				Guid.NewGuid(),
				request.Name);
			if (!string.IsNullOrEmpty(error))
			{
				return BadRequest(error);
			}
			var boardId = await _boardsService.CreateBoardKanban(board);
			return Ok(board);
		}

		[HttpPut("{id:guid}")]
		public async Task<ActionResult<Guid>> UpdateBoards(Guid id, [FromBody] BoardsKanbanRequest request)
		{
			var boardId = await _boardsService.UpdateBoardKanban(id, request.Name);
			return (boardId);
		}

		[HttpDelete("{id:guid}")]
		public async Task<ActionResult<Guid>> DeleteBoards(Guid id)
		{
			return Ok(await _boardsService.DeleteBoardKanban(id));
		}

		// Новый метод для получения колонок по ID доски
		[HttpGet("{boardId:guid}/columns")]
		public async Task<ActionResult<List<ColumnsKanbanResponse>>> GetColumnsByBoardId(Guid boardId)
		{
			var columns = await _columnsService.GetColumnsByBoardId(boardId);
			var response = columns.Select(c => new ColumnsKanbanResponse(c.Id, c.Name));
			return Ok(response);
		}

	}
}