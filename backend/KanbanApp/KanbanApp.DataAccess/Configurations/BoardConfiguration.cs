using KanbanApp.Core.Model;
using KanbanApp.DataAccess.Entites;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace KanbanApp.DataAccess.Configurations
{
	internal class BoardConfiguration : IEntityTypeConfiguration<BoardEntity>
	{
		public void Configure(EntityTypeBuilder<BoardEntity> builder)
		{
			// Первичный ключ для сущности
			builder.HasKey(x => x.Id);

			// Настройка свойства Name
			builder.Property(b => b.Name)
				.HasMaxLength(Board.MAX_KANBANBOARD_NAME_LENGTH) // Максимальная длина													  
				.IsRequired();  // Имя обязательно для заполнения
		}
	}
}
