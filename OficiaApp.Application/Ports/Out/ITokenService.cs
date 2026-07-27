namespace OficiaApp.Application.Ports.Out;

public interface ITokenService
{
    string GenerateToken(Guid userId, string username, string email);
}
