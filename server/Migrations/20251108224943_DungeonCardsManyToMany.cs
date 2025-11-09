using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class DungeonCardsManyToMany : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CardDungeon",
                columns: table => new
                {
                    CardsId = table.Column<int>(type: "INTEGER", nullable: false),
                    DungeonsId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CardDungeon", x => new { x.CardsId, x.DungeonsId });
                    table.ForeignKey(
                        name: "FK_CardDungeon_Cards_CardsId",
                        column: x => x.CardsId,
                        principalTable: "Cards",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CardDungeon_Dungeons_DungeonsId",
                        column: x => x.DungeonsId,
                        principalTable: "Dungeons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CardDungeon_DungeonsId",
                table: "CardDungeon",
                column: "DungeonsId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CardDungeon");
        }
    }
}
