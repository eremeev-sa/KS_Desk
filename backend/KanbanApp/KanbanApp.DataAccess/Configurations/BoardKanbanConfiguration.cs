using KanbanApp.Core.Model;
using KanbanApp.DataAccess.Entites;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace KanbanApp.DataAccess.Configurations
{
	internal class BoardKanbanConfiguration : IEntityTypeConfiguration<BoardKanbanEntity>
	{
		public void Configure(EntityTypeBuilder<BoardKanbanEntity> builder)
		{
			builder.HasKey(x => x.Id);

			builder.Property(b => b.Name)
				.HasMaxLength(BoardKanban.MAX_KANBANBOARD_NAME_LENGTH)
				.IsRequired();

			// Связь с колонками
			builder.HasMany(b => b.Columns) // Board имеет много колонок
				.WithOne(c => c.Board) // Каждая колонка принадлежит Board
				.HasForeignKey(c => c.BoardId) // Связь через BoardId
				.OnDelete(DeleteBehavior.Cascade); // Удаление колонок при удалении Board
		}
	}
}
