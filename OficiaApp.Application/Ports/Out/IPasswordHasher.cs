namespace OficiaApp.Application.Ports.Out;

public interface IPasswordHasher
{
    string Hash(string plainPassword);
    bool Verify(string plainPassword, string passwordHash);
}
