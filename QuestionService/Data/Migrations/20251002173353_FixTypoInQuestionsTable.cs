using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuestionService.Data.Migrations
{
    /// <inheritdoc />
    public partial class FixTypoInQuestionsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AnserCount",
                table: "Questions",
                newName: "AnswerCount");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AnswerCount",
                table: "Questions",
                newName: "AnserCount");
        }
    }
}
