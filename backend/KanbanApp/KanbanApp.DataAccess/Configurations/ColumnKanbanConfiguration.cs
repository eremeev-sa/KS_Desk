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

			builder.Property(b => b.Order)
				.IsRequired(); // Поле обязательное для порядка отображения

			builder.HasMany(c => c.Tasks) // Колонка имеет множество задач
				.WithOne(t => t.Column) // Каждая задача связана с колонкой
				.HasForeignKey(t => t.ColumnId) // Связь через ColumnId
				.OnDelete(DeleteBehavior.Cascade); // Удаление задач при удалении колонки
		}
	}
}
