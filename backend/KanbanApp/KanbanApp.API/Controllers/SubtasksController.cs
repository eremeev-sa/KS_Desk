﻿using KanbanApp.API.Contracts.SubtasksControllers;
using KanbanApp.Core.Model;
using KanbanApp.Core.Models;
using Microsoft.AspNetCore.Mvc;

namespace KanbanApp.API.Controllers
{
	[ApiController]
	[Route("tasks/{taskId:guid}/subtasks")]
	public class SubtasksController : ControllerBase
	{
		private readonly ISubtasksKanbanService _subatasksService;

		public SubtasksController(ISubtasksKanbanService subtasksService)
		{
			_subatasksService = subtasksService;
		}

		//Метод для получение всех подзадач
		[HttpGet("all")]
		public async Task<ActionResult<List<SubtasksResponce>>> GetSubtask()
		{
			var subtasks = await _subatasksService.GetAllSubtasksKanban();
			var responce = subtasks.Select(b => new SubtasksResponce(
				b.Id,
				b.Name
			));
			return Ok(responce);
		}

		//Метод для создания подзадачи
		[HttpPost("create")]
		public async Task<ActionResult<Guid>> CreateSubtask([FromBody] SubtasksRequest request)
		{
			(Subtask subtask, string error) = Subtask.Create(
				Guid.NewGuid(),
				request.Name,
				request.TaskId
			);
			if (!string.IsNullOrEmpty(error))
			{
				return BadRequest(error);
			}

			var subtaskId = await _subatasksService.CreateSubtaskKanban(subtask);
			return Ok(subtaskId);
		}

		//Метод для обновления подзадачи
		[HttpPut("{id:guid}/update")]
		public async Task<ActionResult<Guid>> UpdateSubtask(Guid id, [FromBody] SubtasksUpdateRequest request)
		{
			var subtaskId = await _subatasksService.UpdateSubtaskKanban(
				id,
				request.Name
			);
			return Ok(subtaskId);
		}

		[HttpDelete("{id:guid}/delete")]
		public async Task<ActionResult<Guid>> DeleteSubtask(Guid id)
		{
			return await _subatasksService.DeleteSubtaskKanban(id);
		}
	}
}
