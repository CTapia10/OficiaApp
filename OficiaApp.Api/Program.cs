using OficiaApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using OficiaApp.Domain.Repositories;
using OficiaApp.Infrastructure.Repositories;
using OficiaApp.Application.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers(); // <-- 2. Habilita los Controladores
builder.Services.AddOpenApi();

builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 1. Read allowed origins from appsettings
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();

// 2. Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Inyeccion de Dependencias (El "Catalogo" de herramientas)
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>(); // <-- 3. Registrar el Cerebro de la App
builder.Services.AddScoped<IProfessionalProfileService, ProfessionalProfileService>();
builder.Services.AddScoped<IClientProfileService, ClientProfileService>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// 3. Use CORS
app.UseCors("AllowFrontend");

app.MapControllers(); // <-- Enrutar las peticiones web hacia los Controladores

app.Run();