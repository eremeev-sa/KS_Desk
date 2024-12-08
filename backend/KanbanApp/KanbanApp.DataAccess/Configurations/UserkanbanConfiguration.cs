using KanbanApp.Core.Model;
using KanbanApp.DataAccess.Entites;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace KanbanApp.DataAccess.Configurations
{
	internal class UserKanbanConfiguration : IEntityTypeConfiguration<UserKanbanEntity>
	{
		public void Configure(EntityTypeBuilder<UserKanbanEntity> builder)
		{
			builder.HasKey(x => x.Id);

			builder.Property(b => b.Name)
				.HasMaxLength(UserKanban.MAX_NAME_LENGTH)
				.IsRequired();

			builder.Property(b => b.Login)
				.HasMaxLength(UserKanban.MAX_LOGIN_LENGTH)
				.IsRequired();

			builder.Property(b => b.Password)
				.HasMaxLength(UserKanban.MAX_PASSWORD_LENGTH)
				.IsRequired();

			// Преобразование перечисления Permissions в целое число для базы данных
			builder.Property(b => b.Permissions)
				.HasConversion<int>();

			builder.HasMany(u => u.AssignedTasks)
				.WithOne(t => t.AssignedUser)
				.HasForeignKey(t => t.AssignedUserId)
				.OnDelete(DeleteBehavior.SetNull);
		}
	}
}