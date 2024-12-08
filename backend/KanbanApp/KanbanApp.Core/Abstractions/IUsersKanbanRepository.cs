using KanbanApp.Core.Model;

namespace KanbanApp.DataAccess.Repositories
{
	public interface IUsersKanbanRepository
	{
		Task<List<UserKanban>> Get();
		Task<Guid> Create(UserKanban user);
		Task<Guid> Update(Guid id, string name, string login, string password);
		Task<Guid> Delete(Guid id);
	}
}