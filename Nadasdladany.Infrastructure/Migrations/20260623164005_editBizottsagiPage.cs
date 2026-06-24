using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Nadasdladany.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class editBizottsagiPage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CommitteeText",
                table: "SiteSettings",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CommitteeText",
                table: "SiteSettings");
        }
    }
}
