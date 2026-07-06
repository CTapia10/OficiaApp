using Microsoft.EntityFrameworkCore;
using OficiaApp.Domain.Entities;

namespace OficiaApp.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    // Constructor obligatorio para que ASP.NET pueda inyectarle la configuración (cadena de conexión)
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
        // Reglas
        base.OnModelCreating(modelBuilder);
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

    }
}