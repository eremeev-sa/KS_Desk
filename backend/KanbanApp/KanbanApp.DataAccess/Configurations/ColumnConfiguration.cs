using KanbanApp.Core.Model;
using KanbanApp.DataAccess.Entites;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace KanbanApp.DataAccess.Configurations
{
	internal class ColumnConfiguration : IEntityTypeConfiguration<ColumnEntity>
	{
		public void Configure(EntityTypeBuilder<ColumnEntity> builder)
		{
			builder.HasKey(x => x.Id);

			builder.Property(b => b.Name)
				.HasMaxLength(Column.MAX_KANBANCOLUMN_NAME_LENGTH)
				.IsRequired();

			builder.Property(b => b.Order)
				.IsRequired(); // Поле обязательное для порядка отображения
		}
	}
}
