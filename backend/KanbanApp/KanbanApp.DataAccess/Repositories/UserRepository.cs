using KanbanApp.Core.Model;
using KanbanApp.DataAccess.Entites;
using Microsoft.EntityFrameworkCore;

namespace KanbanApp.DataAccess.Repositories
{
	public class UserRepository : IUsersKanbanRepository
	{
		private KanbanAppDbContext _context;

		public UserRepository(KanbanAppDbContext context)
		{
			_context = context;
		}

		public async Task<List<UserKanban>> Get()
		{
			var userEntities = await _context.Users
				.AsNoTracking()
				.ToListAsync();

			var users = userEntities
				.Select(b => UserKanban.Create(b.Id, b.Name, b.Login, b.Password).User)
				.ToList();
			return users;
		}

		public async Task<Guid> Create(UserKanban user)
		{
			var userEntity = new UserKanbanEntity
			{
				Id = user.Id,
				Name = user.Name,
				Login = user.Login,
				Password = user.Password
			};
			await _context.Users.AddAsync(userEntity);
			await _context.SaveChangesAsync();

			return userEntity.Id;

		}

		public async Task<Guid> Update(Guid id, string name, string login, string password)
		{
			await _context.Users
				.Where(b => b.Id == id)
				.ExecuteUpdateAsync(s => s
					.SetProperty(b => b.Name, b => name)
					.SetProperty(b => b.Login, b => login)
					.SetProperty(b => b.Password, b => password)
				);
			return id;
		}

		public async Task<Guid> Delete(Guid id)
		{
			await _context.Users
				.Where(b => b.Id == id)
				.ExecuteDeleteAsync();
			return id;
		}
	}
}