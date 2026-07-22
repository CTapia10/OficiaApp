using Microsoft.EntityFrameworkCore;
using OficiaApp.Domain.Common;
using OficiaApp.Domain.Entities;

namespace OficiaApp.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Category> Categories { get; set; }
    public DbSet<JobContract> JobContracts { get; set; }
    public DbSet<JobRequest> JobRequests { get; set; }
    public DbSet<ClientProfile> ClientProfiles { get; set; }
    public DbSet<ProfessionalProfile> ProfessionalProfiles { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (typeof(BaseEntity).IsAssignableFrom(entityType.ClrType))
            {
                modelBuilder.Entity(entityType.ClrType)
                    .Property(nameof(BaseEntity.CreatedAt))
                    .HasColumnName("FechaCreacion");
            }
        }

        modelBuilder.Entity<JobContract>()
            .Property(j => j.AgreedPrice)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<ProfessionalProfile>()
            .Property(p => p.HourlyRate)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<JobContract>()
            .HasOne(j => j.ProfessionalProfile)
            .WithMany()
            .HasForeignKey(j => j.ProfessionalProfileId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ProfessionalProfile>()
            .HasMany(p => p.Categories)
            .WithMany(c => c.ProfessionalProfiles)
            .UsingEntity(j => j.ToTable("ProfessionalProfileCategories"));

        modelBuilder.Entity<JobRequest>(e =>
        {
            // PrimitiveCollection (not Property) — required for List<string> migrations scaffolding in EF Core 9
            e.PrimitiveCollection<List<string>>("_imagesUrls")
                .HasColumnName("ImageUrls");
        });
    }
}
