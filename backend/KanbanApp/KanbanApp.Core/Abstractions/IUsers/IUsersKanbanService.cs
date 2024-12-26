using KanbanApp.Core.Model;

namespace KanbanApp.Core.Abstractions.IUsers
{
    public interface IUsersKanbanService
    {
        // Метод для создания нового пользователя
        Task<Guid> RegisterUser(UserKanban user);

        // Метод для обновления пользователя 
        Task<Guid> UpdateUser(Guid id, string name, string login, string password, string role);

        // Метод для удаления пользователя 
        Task<Guid> DeleteUser(Guid id);

        // Метод для получения всех пользователей
        Task<List<UserKanban>> GetAllUsers();

        Task<UserKanban> Login(LoginRequest request);
    }
}
