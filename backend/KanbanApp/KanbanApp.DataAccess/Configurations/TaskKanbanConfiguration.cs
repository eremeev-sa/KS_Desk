using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using KanbanApp.Core.Model;

public class TaskKanbanConfiguration : IEntityTypeConfiguration<TaskKanbanEntity>
{
	public void Configure(EntityTypeBuilder<TaskKanbanEntity> builder)
	{
		builder.HasKey(x => x.Id);

		builder.Property(b => b.Name)
			.HasMaxLength(TaskKanban.MAX_TASK_NAME_LENGTH)
			.IsRequired();

		builder.Property(b => b.Assignee); // Сохраняем поле для Assignee

		builder.Property(b => b.Priority)
			.IsRequired();

		builder.Property(b => b.Description);

		// Связь с пользователем
		builder.HasOne(t => t.AssignedUser)
			.WithMany(u => u.AssignedTasks)
			.HasForeignKey(t => t.AssignedUserId)
			.OnDelete(DeleteBehavior.SetNull);  // Если удаляется пользователь, назначение задачи не удаляется
	}
}
