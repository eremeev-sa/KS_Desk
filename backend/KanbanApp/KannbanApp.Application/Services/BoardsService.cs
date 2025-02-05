using KanbanApp.Core.Abstractions.IBoards;
using KanbanApp.Core.Model;
using KanbanApp.Core.Models;

namespace KanbanApp.Application.Services
{
    public class BoardsService : IBoardsService
	{
		private readonly IBoardsRepository _boardsRepository;

		public BoardsService(IBoardsRepository boardsRepository)
		{
			_boardsRepository = boardsRepository;
		}

		// Метод для получения всех канбан-досок
		public async Task<List<Board>> GetAllBoardsKanban()
		{
			return await _boardsRepository.Get();
		}

		// Метод для создания новой канбан-доски
		public async Task<Guid> CreateBoardKanban(Board board, Guid userId)
		{
			return await _boardsRepository.Create(board, userId);
		}

		// Метод для обновления существующей канбан-доски
		public async Task<Guid> UpdateBoardKanban(Guid id, string name)
		{
			return await _boardsRepository.Update(id, name);
		}

		// Метод для удаления канбан-доски по ID
		public async Task<Guid> DeleteBoardKanban(Guid id)
		{
			return await _boardsRepository.Delete(id);
		}
		
		//Метод для получения доски по id
		public async Task<Board> GetById(Guid boardId)
		{
			return await _boardsRepository.GetById(boardId);
		}
		
		//Метод для добавления пользователей
		public async Task<Guid> AddUserToBoard(BoardUser boardUser)
		{
			return await _boardsRepository.AddUserToBoard(boardUser);
		}
		
		//Метод, который показывает пользователей конкретной доски по id
		public async Task<List<User>> GetUsersOnBoard(Guid boardId)
		{
			return await _boardsRepository.GetUsersOnBoard(boardId);
		}

	}
}
