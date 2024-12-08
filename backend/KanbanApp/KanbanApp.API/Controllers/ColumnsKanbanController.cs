using KanbanApp.API.Contracts.ColumnsControllers;
using KanbanApp.Core.Model;
using Microsoft.AspNetCore.Mvc;

namespace KanbanApp.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ColumnsKanbanController : ControllerBase
    {
        private readonly IColumnsKanbanService _columnsService;

        public ColumnsKanbanController(IColumnsKanbanService columnsService)
        {
            _columnsService = columnsService;
        }

        [HttpGet]
        public async Task<ActionResult<List<ColumnsKanbanResponse>>> GetColumns()
        {
            var columns = await _columnsService.GetAllColumnsKanban();
            var response = columns.Select(b => new ColumnsKanbanResponse(b.Id, b.Name));
            return Ok(response);
        }

		[HttpPost]
		public async Task<ActionResult<Guid>> CreateColumns([FromBody] ColumnsKanbanRequest request)
		{
			int defaultOrder = 0; // Пример, порядок по умолчанию
			(ColumnKanban column, string error) = ColumnKanban.Create(
				Guid.NewGuid(),
				request.Name,
				defaultOrder);  // Порядок теперь передается
			if (!string.IsNullOrEmpty(error))
			{
				return BadRequest(error);
			}
			var columnId = await _columnsService.CreateColumnKanban(column);
			return Ok(columnId);
		}

		[HttpPut("{id:guid}")]
		public async Task<ActionResult<Guid>> UpdateColumns(Guid id, [FromBody] ColumnsKanbanRequest request)
		{
			int order = 0; // Пример, порядок по умолчанию
			var columnId = await _columnsService.UpdateColumnKanban(id, request.Name, order);  // Передаем порядок
			return Ok(columnId);
		}

		[HttpDelete("{id:guid}")]
        public async Task<ActionResult<Guid>> DeleteColumns(Guid id)
        {
            return Ok(await _columnsService.DeleteColumnKanban(id));
        }

        // Новый метод для обновления порядка колонок
        [HttpPut("order")]
        public async Task<ActionResult> UpdateColumnsOrder([FromBody] UpdateColumnsOrderRequest request)
        {
            await _columnsService.UpdateColumnsOrder(request.OrderedColumnIds);
            return Ok();
        }
    }
}
