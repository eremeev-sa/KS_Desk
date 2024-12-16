using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KanbanApp.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class Kanban03 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Assignee",
                table: "Tasks");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Assignee",
                table: "Tasks",
                type: "text",
                nullable: true);
        }
    }
}
