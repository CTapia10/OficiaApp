using OficiaApp.Domain.Entities;

namespace OficiaApp.Application.Ports.Out;

public interface ITokenService
{
    string GenerateToken(User user);
}
