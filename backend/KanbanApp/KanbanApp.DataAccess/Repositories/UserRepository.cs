using System.IdentityModel.Tokens.Jwt;
using System.Security.AccessControl;
using System.Security.Claims;
using System.Text;
using KanbanApp.Core.Model;
using KanbanApp.DataAccess.Entites;
using KanbanApp.DataAccess;
using Microsoft.EntityFrameworkCore;
using KanbanApp.Core.Abstractions.IUsers;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

public class UserRepository : IUsersKanbanRepository
{
	private KanbanAppDbContext _context;
	private string _secretKey;

	public UserRepository(KanbanAppDbContext context, IConfiguration configuration)
	{
		_context = context;
		_secretKey = configuration["ApiSettings:Secret"];

		if (string.IsNullOrEmpty(_secretKey))
		{
			throw new Exception("Ошибка!");
		}
	}


	// Получение всех пользователей
	public async Task<List<UserKanban>> Get()
	{
		var userEntities = await _context.Users
			.AsNoTracking()
			.ToListAsync();

		var users = userEntities
			.Select(b => UserKanban.Create(b.Id, b.Name, b.Login, b.Password, b.Role).User)
			.Where(user => user != null)
			.ToList();

		return users;
	}

	// Создание нового пользователя
	public async Task<Guid> Register(UserKanban user)
	{
		var userEntity = new UserKanbanEntity
		{
			Id = user.Id,
			Name = user.Name,
			Login = user.Login,
			Password = user.Password,
			Role = user.Role
		};

		await _context.Users.AddAsync(userEntity);
		await _context.SaveChangesAsync();

		return userEntity.Id;
	}

	// Обновление данных пользователя
	public async Task<Guid> Update(Guid id, string name, string login, string password, string role)
	{
		await _context.Users
			.Where(b => b.Id == id)
			.ExecuteUpdateAsync(s => s
				.SetProperty(b => b.Name, b => name)
				.SetProperty(b => b.Login, b => login)
				.SetProperty(b => b.Password, b => password)
				.SetProperty(b => b.Role, b => role)
			);

		return id;
	}

	// Удаление пользователя
	public async Task<Guid> Delete(Guid id)
	{
		await _context.Users
			.Where(b => b.Id == id)
			.ExecuteDeleteAsync();

		return id;
	}

	public bool IsUniqueLogin(string login)
	{
		var userEntity = _context.Users.FirstOrDefault(b => b.Login == login);
		if (userEntity == null) return true;
		return false;
	}

	public async Task<UserKanban> Login(LoginRequest request)
	{
		var userEntity = _context.Users
			.FirstOrDefault(b => b.Login.ToLower() == request.Login.ToLower() && b.Password == request.Password);
        
		if (userEntity == null)
		{
			return null;
		}

		// Генерация токенов
		var tokenHandler = new JwtSecurityTokenHandler();
		var key = Encoding.ASCII.GetBytes(_secretKey);

		var tokenDescriptor = new SecurityTokenDescriptor
		{
			Subject = new ClaimsIdentity(new Claim[]
			{
				new Claim(ClaimTypes.Name, userEntity.Id.ToString()),
				new Claim(ClaimTypes.Role, userEntity.Role)
			}),
			Expires = DateTime.UtcNow.AddDays(7),
			SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
		};

		var token = tokenHandler.CreateToken(tokenDescriptor);
		var tokenString = tokenHandler.WriteToken(token);
		
		var (userKanban, _) = UserKanban.Create(userEntity.Id, userEntity.Name, userEntity.Login, userEntity.Password, userEntity.Role);

		if (userKanban != null)
		{
			userKanban.Token = tokenString;
		}
		return userKanban;
	}
}


