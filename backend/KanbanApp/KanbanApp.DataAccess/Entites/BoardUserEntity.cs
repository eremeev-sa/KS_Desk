namespace KanbanApp.DataAccess.Entites;

public class BoardUserEntity
{
    public Guid BoardId { get; set; }
    public BoardEntity Board { get; set; }
    public Guid UserId { get; set; }
    public UserEntity User { get; set; }
    public string Role { get; set; }
}