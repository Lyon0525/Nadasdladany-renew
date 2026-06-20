using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Nadasdladany.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class aboutvillagepage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CoatOfArmsImageUrl",
                table: "SiteSettings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CoatOfArmsText",
                table: "SiteSettings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "HistoryText",
                table: "SiteSettings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LandmarksText",
                table: "SiteSettings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CoatOfArmsImageUrl",
                table: "SiteSettings");

            migrationBuilder.DropColumn(
                name: "CoatOfArmsText",
                table: "SiteSettings");

            migrationBuilder.DropColumn(
                name: "HistoryText",
                table: "SiteSettings");

            migrationBuilder.DropColumn(
                name: "LandmarksText",
                table: "SiteSettings");
        }
    }
}
