using KanbanApp.Core.Model;

namespace KanbanApp.Core.Abstractions.IUsers
{
    public interface IUsersRepository
    {
        // Метод для получения всех пользователей
        Task<List<User>> Get();

        // Метод для создания нового пользователя
        Task<Guid> Register (User user);

        // Метод для обновления пользователя
        Task<Guid> Update(Guid id, string name, string login, string password, string role);

        // Метод для удаления пользователя
        Task<Guid> Delete(Guid id);
        bool IsUniqueLogin (string login);
        Task<User> Login (LoginRequest request);
        
        // Метод для получения пользователя по ID
        Task<User?> GetUserById(Guid id);
    }
}
