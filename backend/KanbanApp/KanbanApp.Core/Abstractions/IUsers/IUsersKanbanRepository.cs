using KanbanApp.Core.Model;

namespace KanbanApp.Core.Abstractions.IUsers
{
    public interface IUsersKanbanRepository
    {
        // Метод для получения всех пользователей
        Task<List<UserKanban>> Get();

        // Метод для создания нового пользователя
        Task<Guid> Register (UserKanban user);

        // Метод для обновления пользователя
        Task<Guid> Update(Guid id, string name, string login, string password, string role);

        // Метод для удаления пользователя
        Task<Guid> Delete(Guid id);
        bool IsUniqueLogin (string login);
        Task<UserKanban> Login (LoginRequest request);
    }
}
