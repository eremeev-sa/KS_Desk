using KanbanApp.API.Contracts.UsersControllers;
using KanbanApp.Core.Abstractions.IUsers;
using KanbanApp.Core.Model;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using LoginRequest = KanbanApp.Core.Model.LoginRequest;


namespace KanbanApp.API.Controllers
{
    [ApiController]
	[Route("[controller]")]
	public class UsersKanbanController : ControllerBase
	{
		private readonly IUsersKanbanService _usersService;

		public UsersKanbanController(IUsersKanbanService usersService)
		{
			_usersService = usersService;
		}

		// Метод для получения всех пользователей
		[HttpGet]
		public async Task<ActionResult<List<UsersKanbanResponse>>> GetUsers()
		{
			var users = await _usersService.GetAllUsers();
			var response = users.Select(b => new UsersKanbanResponse(b.Id, b.Name, b.Login, b.Password));
			return Ok(response);
		}

		// Метод для создания нового пользователя
		[HttpPost("register")]
		public async Task<ActionResult<Guid>> RegisterUser([FromBody] UsersKanbanRequest request)
		{
			(UserKanban? user, string error) = UserKanban.Create(
				Guid.NewGuid(),
				request.Name,
				request.Login,
				request.Password,
				request.Role);

			if (user == null)
			{
				return BadRequest(error);
			}

			var userId = await _usersService.RegisterUser(user);

			return Ok(userId);
		}

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


		// Метод для обновления данных пользователя
		[HttpPut("{id:guid}")]
		public async Task<ActionResult<Guid>> UpdateUsers(Guid id, [FromBody] UsersKanbanRequest request)
		{
			
			if(string.IsNullOrEmpty(request.Name) || string.IsNullOrEmpty(request.Login) || string.IsNullOrEmpty(request.Password))
			{
				return BadRequest("Имя, ЛОгин, Пароль обязательны для заполнения");	
			}
			
			var userId = await _usersService.UpdateUser(id, request.Name, request.Login, request.Password, request.Role);
			return Ok(userId);
		}

		// Метод для удаления пользователя
		[HttpDelete("{id:guid}")]
		public async Task<ActionResult<Guid>> DeleteUser(Guid id)
		{
			return Ok(await _usersService.DeleteUser(id));
		}
	}
}
