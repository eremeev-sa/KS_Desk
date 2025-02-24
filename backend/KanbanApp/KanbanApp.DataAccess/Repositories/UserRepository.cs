using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using KanbanApp.Core.Abstractions.IUsers;
using KanbanApp.Core.Model;
using KanbanApp.DataAccess.Entites;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace KanbanApp.DataAccess.Repositories;

public class UserRepository : IUsersRepository
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
	public async Task<List<User>> Get()
	{
		var userEntities = await _context.Users.AsNoTracking().ToListAsync();
		var users = userEntities
			.Select(b => User.Create(b.Id, b.Name, b.Login, b.Password, b.Role).User)
			.Where(user => user != null)
			.ToList();
		return users;
	}

	// Создание нового пользователя
	public async Task<Guid> Register(User user)
	{
		// Хешируем пароль перед сохранением в базу данных
		var hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.Password);

		var userEntity = new UserEntity
		{
			Id = user.Id,
			Name = user.Name,
			Login = user.Login,
			Password = hashedPassword,  
			Role = "user"
		};

		await _context.Users.AddAsync(userEntity);
		await _context.SaveChangesAsync();

		return userEntity.Id;
	}

	// Обновление данных пользователя
	public async Task<Guid> Update(Guid id, string name, string login, string password, string role)
	{
		// Хешируем пароль перед обновлением
		var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);

		await _context.Users
			.Where(b => b.Id == id)
			.ExecuteUpdateAsync(s => s
				.SetProperty(b => b.Name, name)
				.SetProperty(b => b.Login, login)
				.SetProperty(b => b.Password, hashedPassword)  // Хешируем пароль
				.SetProperty(b => b.Role, role)
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

	// Логин пользователя (сравнивается хеш пароля)
	public async Task<User> Login(LoginRequest request)
	{
		var userEntity = _context.Users
			.FirstOrDefault(b => b.Login.ToLower() == request.Login.ToLower());

		if (userEntity == null || !BCrypt.Net.BCrypt.Verify(request.Password, userEntity.Password)) // Проверка хешированного пароля
		{
			return null;
		}

		// Генерация токенов
		var tokenHandler = new JwtSecurityTokenHandler();
		var key = Encoding.ASCII.GetBytes(_secretKey);

		var tokenDescriptor = new SecurityTokenDescriptor
		{
			Subject = new ClaimsIdentity(new[]
			{
				new Claim(ClaimTypes.Name, userEntity.Id.ToString()),
				new Claim(ClaimTypes.Role, userEntity.Role)
			}),
			Expires = DateTime.UtcNow.AddDays(7),
			SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
		};

		var token = tokenHandler.CreateToken(tokenDescriptor);
		var tokenString = tokenHandler.WriteToken(token);
        
		var (userKanban, _) = User.Create(userEntity.Id, userEntity.Name, userEntity.Login, userEntity.Password, userEntity.Role);

		if (userKanban != null)
		{
			userKanban.Token = tokenString;
		}
		return userKanban;
	}
	
	// Получение пользователя по ID
	public async Task<User?> GetUserById(Guid id)
	{
		var userEntity = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == id);
		return userEntity != null ? User.Create(userEntity.Id, userEntity.Name, userEntity.Login, userEntity.Password, userEntity.Role).User : null;
	}
}