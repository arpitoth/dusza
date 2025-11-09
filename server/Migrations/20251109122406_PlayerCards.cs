using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class PlayerCards : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PlayerCardsId",
                table: "Cards",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "PlayerCards",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    GameId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlayerCards", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Cards_PlayerCardsId",
                table: "Cards",
                column: "PlayerCardsId");

            migrationBuilder.AddForeignKey(
                name: "FK_Cards_PlayerCards_PlayerCardsId",
                table: "Cards",
                column: "PlayerCardsId",
                principalTable: "PlayerCards",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cards_PlayerCards_PlayerCardsId",
                table: "Cards");

            migrationBuilder.DropTable(
                name: "PlayerCards");

            migrationBuilder.DropIndex(
                name: "IX_Cards_PlayerCardsId",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "PlayerCardsId",
                table: "Cards");
        }
    }
}
