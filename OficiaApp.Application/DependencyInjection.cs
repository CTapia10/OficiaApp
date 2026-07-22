using Microsoft.Extensions.DependencyInjection;
using OficiaApp.Application.Ports.In;
using OficiaApp.Application.UseCases;

namespace OficiaApp.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IProfessionalProfileService, ProfessionalProfileService>();
        services.AddScoped<IClientProfileService, ClientProfileService>();
        services.AddScoped<ICategoryService, CategoryService>();
        services.AddScoped<IJobRequestService, JobRequestService>();
        return services;
    }
}
