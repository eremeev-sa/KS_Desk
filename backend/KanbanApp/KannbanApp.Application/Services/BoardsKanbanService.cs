using KanbanApp.Core.Abstractions;
using KanbanApp.Core.Model;

namespace KanbanApp.Application.Services
{
	public class BoardsKanbanService : IBoardsKanbanService
	{
		private readonly IBoardsKanbanRepository _boardsKanbanRepository;

		public BoardsKanbanService(IBoardsKanbanRepository boardsKanbanRepository)
		{
			_boardsKanbanRepository = boardsKanbanRepository;
		}

		public async Task<List<BoardKanban>> GetAllBoardsKanban()
		{
			return await _boardsKanbanRepository.Get();
		}

		public async Task<Guid> CreateBoardKanban(BoardKanban boardKanban)
		{
			return await _boardsKanbanRepository.Create(boardKanban);
		}

		public async Task<Guid> UpdateBoardKanban(Guid id, string name)
		{
			return await _boardsKanbanRepository.Update(id, name);
		}

		public async Task<Guid> DeleteBoardKanban(Guid id)
		{
			return await _boardsKanbanRepository.Delete(id);
		}
	}
}