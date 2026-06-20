using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Nadasdladany.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddElectionsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Elections",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Year = table.Column<int>(type: "int", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RegisteredVoters = table.Column<int>(type: "int", nullable: false),
                    VotedCount = table.Column<int>(type: "int", nullable: false),
                    TurnoutPercentage = table.Column<double>(type: "float", nullable: false),
                    CandidatesJson = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Elections", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Elections");
        }
    }
}
