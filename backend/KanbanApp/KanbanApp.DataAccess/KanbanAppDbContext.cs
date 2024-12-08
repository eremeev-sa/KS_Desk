using KanbanApp.DataAccess.Entites;
using Microsoft.EntityFrameworkCore;

namespace KanbanApp.DataAccess
{
	public class KanbanAppDbContext : DbContext
	{
		public KanbanAppDbContext(DbContextOptions<KanbanAppDbContext> options)
			: base(options)
		{

		}
		public DbSet<UserKanbanEntity> Users { get; set; }
		public DbSet<TaskKanbanEntity> Tasks { get; set; }
		public DbSet<BoardKanbanEntity> Boards { get; set; }
		public DbSet<ColumnKanbanEntity> Columns { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);

			// При удалении доски все связанные с ней колонки должны быть удалены
			modelBuilder.Entity<ColumnKanbanEntity>()
				.HasOne(c => c.Board)
				.WithMany(b => b.Columns)
				.HasForeignKey(c => c.BoardId)
				.OnDelete(DeleteBehavior.Cascade);

			// При удалении колонки все связанные с ней задачи должны быть удалены
			modelBuilder.Entity<TaskKanbanEntity>()
				.HasOne(t => t.Column) 
				.WithMany(c => c.Tasks) 
				.HasForeignKey(t => t.ColumnId) 
				.OnDelete(DeleteBehavior.Cascade);

			// При удалении пользователя внешний ключ в задаче на пользователя должен быть установлен в null
			modelBuilder.Entity<TaskKanbanEntity>()
				.HasOne(t => t.AssignedUser)  
				.WithMany(u => u.AssignedTasks) 
				.HasForeignKey(t => t.AssignedUserId) 
				.OnDelete(DeleteBehavior.SetNull); 
		}
	}
}