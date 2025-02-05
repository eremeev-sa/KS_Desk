using KanbanApp.Core.Model;
using KanbanApp.DataAccess.Entites;
using KanbanApp.DataAccess;
using Microsoft.EntityFrameworkCore;
using KanbanApp.Core.Abstractions.IBoards;
using KanbanApp.Core.Models;

public class BoardRepository : IBoardsRepository
{
	private readonly KanbanAppDbContext _context;

	public BoardRepository(KanbanAppDbContext context)
	{
		_context = context;
	}

	// Получение всех досок Kanban
	public async Task<List<Board>> Get()
	{
		var boardEntities = await _context.Boards
			.AsNoTracking()  // Отключение отслеживания изменений
			.ToListAsync();  

		var boards = boardEntities
			.Select(b => Board.Create(b.Id, b.Name).BoardKanban)  
			.ToList();  

		return boards;  
	}

	// Создание новой доски Kanban
	public async Task<Guid> Create(Board board, Guid userId)
	{
		// Преобразование модели BoardKanban в сущность BoardKanbanEntity
		var boardEntity = new BoardEntity
		{
			Id = board.Id,  
			Name = board.Name,
			OwnerId = userId
		};

		// Добавление сущности Board в контекст
		await _context.Boards.AddAsync(boardEntity);

		// Обновление роли пользователя на "admin"
		var userEntity = await _context.Users.FindAsync(userId);
		if (userEntity != null)
		{
			userEntity.Role = "admin";
			_context.Users.Update(userEntity);
		}

		await _context.SaveChangesAsync();

		return boardEntity.Id;  
	}

	// Обновление данных доски Kanban
	public async Task<Guid> Update(Guid id, string name)
	{
		await _context.Boards
			.Where(b => b.Id == id)  
			.ExecuteUpdateAsync(s => s  
				.SetProperty(b => b.Name, b => name)  
			);
		return id;  
	}

	// Удаление доски Kanban
	public async Task<Guid> Delete(Guid id)
	{
		await _context.Boards
			.Where(b => b.Id == id)  
			.ExecuteDeleteAsync();  

		return id;  
	}
	//Получение доски по id
	public async Task<Board> GetById(Guid boardId)
	{
		var boardEntity = await _context.Boards
			.AsNoTracking()
			.FirstOrDefaultAsync(b => b.Id == boardId);

		if (boardEntity == null)
		{
			throw new KeyNotFoundException("Доска не найдена");
		}

		return Board.Create(boardEntity.Id, boardEntity.Name).BoardKanban;
	}
	
	//Метод добавления пользователя в доску
	public async Task<Guid> AddUserToBoard(BoardUser boardUser)
	{
		var boardUserEntity = new BoardUserEntity
		{
			BoardId = boardUser.BoardId,
			UserId = boardUser.UserId,
			Role = boardUser.Role
		};

		await _context.BoardUsers.AddAsync(boardUserEntity);
		await _context.SaveChangesAsync();

		return boardUserEntity.BoardId;
	}
	
	//Метод для получения всех пользователей доски
	public async Task<List<User>> GetUsersOnBoard(Guid boardId)
	{
		var users = await _context.BoardUsers
			.Where(bu => bu.BoardId == boardId)
			.Include(bu => bu.User)
			.Select(bu => new
			{
				bu.User.Id,
				bu.User.Name,
				bu.User.Login,
				bu.User.Password,
				bu.User.Role
			})
			.ToListAsync();

		var result = users
			.Select(u => User.Create(u.Id, u.Name, u.Login, u.Password, u.Role).User)
			.Where(user => user != null)
			.ToList();

		return result!;
	}

}
