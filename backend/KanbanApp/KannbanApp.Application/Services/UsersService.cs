using KanbanApp.Core.Abstractions.IUsers;
using KanbanApp.Core.Model;


namespace KanbanApp.Application.Services
{
    public class UsersService : IUsersKanbanService
	{
		private readonly IUsersKanbanRepository _usersRepository;

		public UsersService(IUsersKanbanRepository usersRepository)
		{
			_usersRepository = usersRepository;
		}

		// Метод для получения всех пользователей
		public async Task<List<UserKanban>> GetAllUsers()
		{
			return await _usersRepository.Get();
		}

		// Метод для создания нового пользователя
		public async Task<Guid> RegisterUser(UserKanban user)
		{
			return await _usersRepository.Register(user);
		}

		// Метод для обновления данных пользователя
		public async Task<Guid> UpdateUser(Guid id, string name, string login, string password, string role)
		{
			return await _usersRepository.Update(id, name, login, password, role);
		}

		// Метод для удаления пользователя
		public async Task<Guid> DeleteUser(Guid id)
		{
			return await _usersRepository.Delete(id);
		}
		public async Task<UserKanban> Login(LoginRequest request)
		{
			return await _usersRepository.Login(request);
		}

	}
}
