namespace KanbanApp.Core.Model
{
    public class LoginResponse
    {
        public UserKanban User { get; set; }
        public string Token { get; set; }

        public LoginResponse(UserKanban user, string token)
        {
            User = user;
            Token = token;
        }
    }
}