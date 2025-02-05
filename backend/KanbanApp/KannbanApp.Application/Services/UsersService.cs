using KanbanApp.Core.Abstractions.IUsers;
using KanbanApp.Core.Model;


namespace KanbanApp.Application.Services
{
    public class UsersService : IUsersService
	{
		private readonly IUsersRepository _usersRepository;

		public UsersService(IUsersRepository usersRepository)
		{
			_usersRepository = usersRepository;
		}

		// Метод для получения всех пользователей
		public async Task<List<User>> GetAllUsers()
		{
			return await _usersRepository.Get();
		}

		// Метод для создания нового пользователя
		public async Task<Guid> RegisterUser(User user)
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
		public async Task<User> Login(LoginRequest request)
		{
			return await _usersRepository.Login(request);
		}
		
		// Метод для получения пользователя по ID
		public async Task<User?> GetUserById(Guid id)
		{
			return await _usersRepository.GetUserById(id);
		}

	}
}
