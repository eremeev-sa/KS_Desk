using KanbanApp.Core.Model;
namespace KanbanApp.Core.Abstractions
{
	public interface IBoardsKanbanRepository
	{
		Task<List<BoardKanban>> Get();
		Task<Guid> Create(BoardKanban boardKanban);
		Task<Guid> Update(Guid id, string name);
		Task<Guid> Delete(Guid id);
	}
}