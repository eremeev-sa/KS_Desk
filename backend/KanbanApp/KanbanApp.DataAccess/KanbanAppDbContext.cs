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

		public DbSet<UserEntity> Users { get; set; }
		public DbSet<TaskEntity> Tasks { get; set; }
		public DbSet<BoardEntity> Boards { get; set; }
		public DbSet<ColumnEntity> Columns { get; set; }
		public DbSet<SubtaskEntity> Subtasks { get; set; }
		public DbSet<BoardUserEntity> BoardUsers { get; set; }
		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);

			// При удалении доски все связанные с ней колонки удаляются
			modelBuilder.Entity<ColumnEntity>()
				.HasOne(c => c.Board)
				.WithMany(b => b.Columns)
				.HasForeignKey(c => c.BoardId)
				.OnDelete(DeleteBehavior.Cascade);

			// При удалении колонки все связанные задачи удаляются
			modelBuilder.Entity<TaskEntity>()
				.HasOne(t => t.Column)
				.WithMany(c => c.Tasks)
				.HasForeignKey(t => t.ColumnId)
				.OnDelete(DeleteBehavior.Cascade);

			// При удалении пользователя задачи остаются, но поле AssignedUserId становится null
			modelBuilder.Entity<TaskEntity>()
				.HasOne(t => t.Assigned)
				.WithMany(u => u.AssignedTasks)
				.HasForeignKey(t => t.AssignedId)
				.OnDelete(DeleteBehavior.SetNull);

			// При удалении задачи все связанные подзадачи удаляются
			modelBuilder.Entity<SubtaskEntity>()
				.HasOne(t => t.Task)
				.WithMany(c => c.Subtasks)
				.HasForeignKey(t => t.TaskId)
				.OnDelete(DeleteBehavior.Cascade);
			
			modelBuilder.Entity<BoardUserEntity>()
				.HasKey(b => new { b.BoardId, b.UserId });

			modelBuilder.Entity<BoardUserEntity>()
				.HasOne(b => b.Board)
				.WithMany(b => b.BoardUsers)
				.HasForeignKey(b => b.BoardId)
				.OnDelete(DeleteBehavior.Cascade);

			modelBuilder.Entity<BoardUserEntity>()
				.HasOne(b => b.User)
				.WithMany(u => u.BoardUsers)
				.HasForeignKey(b => b.UserId)
				.OnDelete(DeleteBehavior.Cascade);
		}
	}
}
