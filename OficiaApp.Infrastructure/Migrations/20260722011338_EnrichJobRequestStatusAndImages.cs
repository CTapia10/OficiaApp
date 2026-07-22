using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OficiaApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class EnrichJobRequestStatusAndImages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImageUrls",
                table: "JobRequests",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "[]");

            // defaultValue: 1 == JobRequestStatus.Pending (enum starts at 1, not 0)
            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "JobRequests",
                type: "int",
                nullable: false,
                defaultValue: 1);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUrls",
                table: "JobRequests");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "JobRequests");
        }
    }
}
