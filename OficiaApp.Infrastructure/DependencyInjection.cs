using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OficiaApp.Application.Ports.Out;
using OficiaApp.Application.Settings;
using OficiaApp.Infrastructure.Data;
using OficiaApp.Infrastructure.Persistence;
using OficiaApp.Infrastructure.Persistence.Repositories;
using OficiaApp.Infrastructure.Security;

namespace OficiaApp.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.Configure<JwtSettings>(configuration.GetSection("JwtSettings"));

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<ICategoryRepository, CategoryRepository>();
        services.AddScoped<IJobRequestRepository, JobRequestRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IPasswordHasher, BCryptPasswordHasher>();
        services.AddScoped<ITokenService, JwtTokenService>();

        return services;
    }
}
