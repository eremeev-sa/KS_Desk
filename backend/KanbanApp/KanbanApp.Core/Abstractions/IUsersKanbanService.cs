using KanbanApp.Core.Model;

namespace KanbanApp.Application.Services
{
	public interface IUsersKanbanService
	{
		Task<Guid> CreateUser(UserKanban user);
		Task<Guid> UpdateUser(Guid id, string name, string login, string password);
		Task<Guid> DeleteUser(Guid id);
		Task<List<UserKanban>> GetAllUsers();

	}
}