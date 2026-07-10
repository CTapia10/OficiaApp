using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OficiaApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCategoriesAndManyToMany : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Categories_ProfessionalProfiles_ProfessionalProfileId",
                table: "Categories");

            migrationBuilder.DropIndex(
                name: "IX_Categories_ProfessionalProfileId",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "ProfessionalProfileId",
                table: "Categories");

            migrationBuilder.CreateTable(
                name: "ProfessionalProfileCategories",
                columns: table => new
                {
                    CategoriesId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProfessionalProfilesId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProfessionalProfileCategories", x => new { x.CategoriesId, x.ProfessionalProfilesId });
                    table.ForeignKey(
                        name: "FK_ProfessionalProfileCategories_Categories_CategoriesId",
                        column: x => x.CategoriesId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProfessionalProfileCategories_ProfessionalProfiles_ProfessionalProfilesId",
                        column: x => x.ProfessionalProfilesId,
                        principalTable: "ProfessionalProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProfessionalProfileCategories_ProfessionalProfilesId",
                table: "ProfessionalProfileCategories",
                column: "ProfessionalProfilesId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProfessionalProfileCategories");

            migrationBuilder.AddColumn<Guid>(
                name: "ProfessionalProfileId",
                table: "Categories",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Categories_ProfessionalProfileId",
                table: "Categories",
                column: "ProfessionalProfileId");

            migrationBuilder.AddForeignKey(
                name: "FK_Categories_ProfessionalProfiles_ProfessionalProfileId",
                table: "Categories",
                column: "ProfessionalProfileId",
                principalTable: "ProfessionalProfiles",
                principalColumn: "Id");
        }
    }
}
