﻿using KanbanApp.Core.Model;
using KanbanApp.DataAccess.Repositories;

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
		public async Task<Guid> CreateUser(UserKanban user)
		{
			return await _usersRepository.Create(user);
		}

		// Метод для обновления данных пользователя
		public async Task<Guid> UpdateUser(Guid id, string name, string login, string password)
		{
			return await _usersRepository.Update(id, name, login, password);
		}

		// Метод для удаления пользователя
		public async Task<Guid> DeleteUser(Guid id)
		{
			return await _usersRepository.Delete(id);
		}
	}
}
