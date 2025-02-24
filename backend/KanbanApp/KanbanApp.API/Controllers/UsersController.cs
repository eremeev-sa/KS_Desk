using KanbanApp.API.Contracts.UsersControllers;
using KanbanApp.Core.Abstractions.IUsers;
using KanbanApp.Core.Model;
using Microsoft.AspNetCore.Mvc;
using LoginRequest = KanbanApp.Core.Model.LoginRequest;


namespace KanbanApp.API.Controllers
{
    [ApiController]
	[Route("users")]
	public class UsersController : ControllerBase
	{
		private readonly IUsersService _usersService;

		public UsersController(IUsersService usersService)
		{
			_usersService = usersService;
		}

		/// <summary>
		/// Метод для получения всех пользователей
		/// </summary>
		[HttpGet("all")]
		public async Task<ActionResult<List<UsersResponse>>> GetUsers()
		{
			var users = await _usersService.GetAllUsers();
    
			if (users == null || !users.Any())
			{
				return NotFound("Пользователи не найдены");
			}
			var response = users.Select(b => new UsersResponse(b.Id, b.Name, b.Login, b.Role)).ToList();
			return Ok(response);
		}

		/// <summary>
		/// Метод регистрации пользователя
		/// </summary>
		[HttpPost("register")]
		public async Task<ActionResult<Guid>> RegisterUser([FromBody] UsersRequest request)
		{
			(User? user, string error) = Core.Model.User.Create(
				Guid.NewGuid(),
				request.Name,
				request.Login,
				request.Password,
				"user");

			if (user == null)
			{
				return BadRequest(error);
			}

			var userId = await _usersService.RegisterUser(user);

			return Ok(userId);
		}
		
		/// <summary>
		/// Метод проверки логина пользователя
		/// </summary>
		 [HttpPost("login")]
		 public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
		 {
			var user = await _usersService.Login(request);
			if (user == null)
			{
				return Unauthorized("Неверный логин или пароль.");
			}

			var response = new LoginResponse(user, user.Token);
			return Ok(response);
		 }
		
		/// <summary>
		/// Метод для обновления данных пользователя
		/// </summary>
		[HttpPut("{id:guid}/update")]
		public async Task<ActionResult<Guid>> UpdateUsers(Guid id, [FromBody] UsersRequest request)
		{
			
			if(string.IsNullOrEmpty(request.Name) || string.IsNullOrEmpty(request.Login) || string.IsNullOrEmpty(request.Password))
			{
				return BadRequest("Имя, ЛОгин, Пароль обязательны для заполнения");	
			}
			
			var existingUser = await _usersService.GetUserById(id);
			if (existingUser == null)
			{
				return NotFound("Пользователь не найден");
			}
			
			var userId = await _usersService.UpdateUser(id, request.Name, request.Login, request.Password,  existingUser.Role);
			return Ok(userId);
		}

		/// <summary>
		/// Метод для удаления пользователя
		/// </summary>
		[HttpDelete("{id:guid}/delete")]
		public async Task<ActionResult<Guid>> DeleteUser(Guid id)
		{
			return Ok(await _usersService.DeleteUser(id));
		}
	}
}
