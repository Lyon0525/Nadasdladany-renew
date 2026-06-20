using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Nadasdladany.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SiteSettingsRefactor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_SiteSettings",
                table: "SiteSettings");

            migrationBuilder.DropColumn(
                name: "SettingKey",
                table: "SiteSettings");

            migrationBuilder.DropColumn(
                name: "SettingValue",
                table: "SiteSettings");

            migrationBuilder.AlterColumn<string>(
                name: "WelcomeTitle",
                table: "SiteSettings",
                type: "nvarchar(250)",
                maxLength: 250,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "MayorName",
                table: "SiteSettings",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "SiteSettings",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SiteSettings",
                table: "SiteSettings",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_SiteSettings",
                table: "SiteSettings");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "SiteSettings");

            migrationBuilder.AlterColumn<string>(
                name: "WelcomeTitle",
                table: "SiteSettings",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(250)",
                oldMaxLength: 250);

            migrationBuilder.AlterColumn<string>(
                name: "MayorName",
                table: "SiteSettings",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(150)",
                oldMaxLength: 150);

            migrationBuilder.AddColumn<string>(
                name: "SettingKey",
                table: "SiteSettings",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SettingValue",
                table: "SiteSettings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SiteSettings",
                table: "SiteSettings",
                column: "SettingKey");
        }
    }
}
