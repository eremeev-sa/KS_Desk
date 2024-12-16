using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KanbanApp.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class Kanban02 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_Users_AssignedUserId",
                table: "Tasks");

            migrationBuilder.RenameColumn(
                name: "AssignedUserId",
                table: "Tasks",
                newName: "AssignedId");

            migrationBuilder.RenameIndex(
                name: "IX_Tasks_AssignedUserId",
                table: "Tasks",
                newName: "IX_Tasks_AssignedId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tasks_Users_AssignedId",
                table: "Tasks",
                column: "AssignedId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_Users_AssignedId",
                table: "Tasks");

            migrationBuilder.RenameColumn(
                name: "AssignedId",
                table: "Tasks",
                newName: "AssignedUserId");

            migrationBuilder.RenameIndex(
                name: "IX_Tasks_AssignedId",
                table: "Tasks",
                newName: "IX_Tasks_AssignedUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tasks_Users_AssignedUserId",
                table: "Tasks",
                column: "AssignedUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
