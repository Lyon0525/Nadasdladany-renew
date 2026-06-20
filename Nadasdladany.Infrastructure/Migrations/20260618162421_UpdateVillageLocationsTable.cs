using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Nadasdladany.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateVillageLocationsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "VillageLocations",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "VillageLocations",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address",
                table: "VillageLocations");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "VillageLocations");
        }
    }
}
