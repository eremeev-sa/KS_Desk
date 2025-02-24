using KanbanApp.Core.Models;

namespace KanbanApp.Core.Model
{
	public class User
	{
		public const int MAX_NAME_LENGTH = 250;
		public const int MAX_LOGIN_LENGTH = 60;
		public const int MAX_PASSWORD_LENGTH = 200;
		public const int MIN_PASSWORD_LENGTH = 5;

		private User(Guid id, string name, string login, string password, string role, string token = null)
		{
			Id = id;
			Name = name;
			Login = login;
			Password = password;
			Role = role;
			Token = token;
		}

		public Guid Id { get; }

		public string Name { get; } = string.Empty;

		public string Login { get; } = string.Empty;

		public string Password { get; } = string.Empty;

		public string Role { get; } = string.Empty;
		
		public string? Token { get; set; }

		public ICollection<BoardUser> Boards { get; set; }

		public static (User? User, string Error) Create(Guid id, string name, string login, string password, string role)
		{
			var error = string.Empty;

			if (string.IsNullOrEmpty(name) || name.Length > MAX_NAME_LENGTH)
			{
				error = "Поле не должно быть пустым или не должно превышать 250 символов";
			}
			else if (string.IsNullOrEmpty(login) || login.Length > MAX_LOGIN_LENGTH)
			{
				error = "Поле не должно быть пустым или не должно превышать 60 символов";
			}
			else if (string.IsNullOrEmpty(password) || password.Length > MAX_PASSWORD_LENGTH || password.Length < MIN_PASSWORD_LENGTH)
			{
				error = "Поле не должно быть пустым или не должно превышать 20 символов и быть не короче 5 символов";
			}

			if (string.IsNullOrEmpty(error))
			{
				var user = new User(id, name, login, password, role);
				return (user, error);
			}

			return (null, error);
		}
	}
}
