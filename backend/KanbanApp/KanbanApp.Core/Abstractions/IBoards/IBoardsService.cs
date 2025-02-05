using KanbanApp.Core.Model;
using KanbanApp.Core.Models;

namespace KanbanApp.Core.Abstractions.IBoards
{
    public interface IBoardsService
    {
        // Метод для создания новой канбан-доски
        Task<Guid> CreateBoardKanban(Board board, Guid userId);

        // Метод для обновления существующей канбан-доски по ID
        Task<Guid> UpdateBoardKanban(Guid id, string name);

        // Метод для удаления канбан-доски по ID
        Task<Guid> DeleteBoardKanban(Guid id);

        // Метод для получения всех канбан-досок
        Task<List<Board>> GetAllBoardsKanban();
        
        //Метод для получения доски по айди
        Task<Board> GetById(Guid boardId);
        //Метод для добавления пользователя
        Task<Guid> AddUserToBoard(BoardUser boardUser);
        //Метод для просмотра пользователей данной доски
        Task<List<User>> GetUsersOnBoard(Guid boardId);
    }
}
