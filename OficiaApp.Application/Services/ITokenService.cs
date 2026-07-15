using OficiaApp.Domain.Entities;

namespace OficiaApp.Application.Services;

public interface ITokenService
{
    string GenerateToken(User user);
}
