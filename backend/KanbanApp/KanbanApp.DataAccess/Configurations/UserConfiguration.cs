using KanbanApp.Core.Model;
using KanbanApp.DataAccess.Entites;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace KanbanApp.DataAccess.Configurations
{
	internal class UserConfiguration : IEntityTypeConfiguration<UserEntity>
	{
		public void Configure(EntityTypeBuilder<UserEntity> builder)
		{
			// Основной ключ (ID) для сущности
			builder.HasKey(x => x.Id);

			// Cвойства Name
			builder.Property(b => b.Name)
				.HasMaxLength(User.MAX_NAME_LENGTH)  // Максимальная длина имени согласно константе в модели UserKanban
				.IsRequired();  // Это поле обязательно для заполнения

			// Свойство Login с аналогичными ограничениями
			builder.Property(b => b.Login)
				.HasMaxLength(User.MAX_LOGIN_LENGTH)  // Максимальная длина логина
				.IsRequired();  // Логин обязателен

			// Свойство Password
			builder.Property(b => b.Password)
				.HasMaxLength(User.MAX_PASSWORD_LENGTH)  // Максимальная длина пароля
				.IsRequired();  // Пароль обязателен для заполнения

			// Преобразование перечисления Permissions
			builder.Property(b => b.Role)
				.HasConversion<int>();  // Перечисление Permissions будет сохраняться в базе как целое число (например, 0 для Read, 1 для Write и т.д.)

			}

	}
}