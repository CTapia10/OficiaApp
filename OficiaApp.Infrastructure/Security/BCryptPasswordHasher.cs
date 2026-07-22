using OficiaApp.Application.Ports.Out;

namespace OficiaApp.Infrastructure.Security;

public class BCryptPasswordHasher : IPasswordHasher
{
    public string Hash(string plainPassword) => BCrypt.Net.BCrypt.HashPassword(plainPassword);

    public bool Verify(string plainPassword, string passwordHash) =>
        BCrypt.Net.BCrypt.Verify(plainPassword, passwordHash);
}
