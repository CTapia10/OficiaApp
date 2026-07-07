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

// Inyección de Dependencias (El "Catálogo" de herramientas)
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>(); // <-- 3. Registrar el Cerebro de la App
builder.Services.AddScoped<IProfessionalProfileService, ProfessionalProfileService>();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapControllers(); // <-- Enrutar las peticiones web hacia los Controladores

app.Run();