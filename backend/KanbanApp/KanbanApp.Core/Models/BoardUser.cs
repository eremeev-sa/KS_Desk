using KanbanApp.Core.Model;

namespace KanbanApp.Core.Models;

public class BoardUser
{
    public Guid BoardId { get; set; }
    public Board Board { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; }
    public string Role { get; set; }
}