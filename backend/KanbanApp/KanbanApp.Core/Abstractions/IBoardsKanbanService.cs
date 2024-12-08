using KanbanApp.Core.Model;

namespace KanbanApp.Core.Abstractions
{
	public interface IBoardsKanbanService
	{
		Task<Guid> CreateBoardKanban(BoardKanban boardKanban);
		Task<Guid> UpdateBoardKanban(Guid id, string name);
		Task<Guid> DeleteBoardKanban(Guid id);
		Task<List<BoardKanban>> GetAllBoardsKanban();
	}
}