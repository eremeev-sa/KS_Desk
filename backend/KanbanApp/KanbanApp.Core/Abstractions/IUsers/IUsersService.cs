using KanbanApp.Core.Model;

namespace KanbanApp.Core.Abstractions.IUsers
{
    public interface IUsersService
    {
        // Метод для создания нового пользователя
        Task<Guid> RegisterUser(User user);

        // Метод для обновления пользователя 
        Task<Guid> UpdateUser(Guid id, string name, string login, string password, string role);

        // Метод для удаления пользователя 
        Task<Guid> DeleteUser(Guid id);

        // Метод для получения всех пользователей
        Task<List<User>> GetAllUsers();

        Task<User> Login(LoginRequest request);
        
        // Метод для получения пользователя по ID
        Task<User?> GetUserById(Guid id);

    }
}
