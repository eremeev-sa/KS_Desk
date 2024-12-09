using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using KanbanApp.Core.Model;

public class TaskKanbanConfiguration : IEntityTypeConfiguration<TaskKanbanEntity>
{
	public void Configure(EntityTypeBuilder<TaskKanbanEntity> builder)
	{
		// Устанавливаем первичный ключ для сущности
		builder.HasKey(x => x.Id);

		// Настройка свойства Name
		builder.Property(b => b.Name)
			.HasMaxLength(TaskKanban.MAX_TASK_NAME_LENGTH) // Ограничение длины имени задачи
			.IsRequired(); // Задача обязательно должна иметь имя

		// Свойство Assignee (назначенный пользователь)
		builder.Property(b => b.Assignee); 

		// Свойство Priority (приоритет)
		builder.Property(b => b.Priority)
			.IsRequired(); 

		// Свойство Description (описание задачи)
		builder.Property(b => b.Description);

		// Настройка связи с пользователем
		builder.HasOne(t => t.AssignedUser)
			.WithMany(u => u.AssignedTasks) // Пользователь может иметь несколько назначенных задач
			.HasForeignKey(t => t.AssignedUserId) // Связь через внешний ключ AssignedUserId
			.OnDelete(DeleteBehavior.SetNull); // Если пользователь удален, назначение задачи остается (ставится в null)

		// Настройка связи с колонкой
		builder.HasOne(t => t.Column) 
			.WithMany(c => c.Tasks) // Одна колонка может содержать несколько задач
			.HasForeignKey(t => t.ColumnId) // Связь через внешний ключ ColumnId
			.OnDelete(DeleteBehavior.Cascade); // Если колонка удалена, удаляются все задачи в этой колонке
	}
}
