using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class Dungeons : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsBoss",
                table: "Cards",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "Dungeons",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Size = table.Column<int>(type: "INTEGER", nullable: false),
                    GameId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Dungeons", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Dungeons_Games_GameId",
                        column: x => x.GameId,
                        principalTable: "Games",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DungeonCards",
                columns: table => new
                {
                    DungeonId = table.Column<int>(type: "INTEGER", nullable: false),
                    CardId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DungeonCards", x => new { x.DungeonId, x.CardId });
                    table.ForeignKey(
                        name: "FK_DungeonCards_Cards_CardId",
                        column: x => x.CardId,
                        principalTable: "Cards",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DungeonCards_Dungeons_DungeonId",
                        column: x => x.DungeonId,
                        principalTable: "Dungeons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DungeonCards_CardId",
                table: "DungeonCards",
                column: "CardId");

            migrationBuilder.CreateIndex(
                name: "IX_Dungeons_GameId",
                table: "Dungeons",
                column: "GameId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DungeonCards");

            migrationBuilder.DropTable(
                name: "Dungeons");

            migrationBuilder.DropColumn(
                name: "IsBoss",
                table: "Cards");
        }
    }
}
