using KanbanApp.Core.Model;
using KanbanApp.DataAccess.Entites;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace KanbanApp.DataAccess.Configurations
{
	internal class ColumnKanbanConfiguration : IEntityTypeConfiguration<ColumnKanbanEntity>
	{
		public void Configure(EntityTypeBuilder<ColumnKanbanEntity> builder)
		{
			builder.HasKey(x => x.Id);

			builder.Property(b => b.Name)
				.HasMaxLength(ColumnKanban.MAX_KANBANCOLUMN_NAME_LENGTH)
				.IsRequired();

			// Добавляем поле для порядка отображения колонок
			builder.Property(b => b.Order)
				.IsRequired(); // Убедитесь, что поле обязательное. Можно добавить дополнительные ограничения, если нужно.

			// Связь с задачами
			builder.HasMany(c => c.Tasks) // Column имеет много задач
				.WithOne(t => t.Column) // Каждая задача принадлежит колонке
				.HasForeignKey(t => t.ColumnId) // Связь через ColumnId
				.OnDelete(DeleteBehavior.Cascade); // Удаление задач при удалении колонки
		}
	}
}
