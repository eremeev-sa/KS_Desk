using KanbanApp.Core.Model;
using Microsoft.EntityFrameworkCore;
using KanbanApp.Core.Abstractions;
using KanbanApp.DataAccess.Entites;

namespace KanbanApp.DataAccess.Repositories
{
	public class BoardKanbanRepository : IBoardsKanbanRepository
	{
		private readonly KanbanAppDbContext _context;

		public BoardKanbanRepository(KanbanAppDbContext context)
		{
			_context = context;
		}

		public async Task<List<BoardKanban>> Get()
		{
			var boardEntities = await _context.Boards
				.AsNoTracking()
				.ToListAsync();
			var boards = boardEntities
				.Select(b => BoardKanban.Create(b.Id, b.Name).BoardKanban)
				.ToList();
			return boards;
		}
		public async Task<Guid> Create(BoardKanban boardKanban)
		{
			var boardKanbanEntity = new BoardKanbanEntity
			{
				Id = boardKanban.Id,
				Name = boardKanban.Name,
			};
			await _context.Boards.AddAsync(boardKanbanEntity);
			await _context.SaveChangesAsync();

			return boardKanbanEntity.Id;

		}

		public async Task<Guid> Update(Guid id, string name)
		{
			await _context.Boards
				.Where(b => b.Id == id)
				.ExecuteUpdateAsync(s => s
					.SetProperty(b => b.Name, b => name)
					);
			return id;
		}

		public async Task<Guid> Delete(Guid id)
		{
			await _context.Boards
				.Where(b => b.Id == id)
				.ExecuteDeleteAsync();
			return id;
		}
	}
}