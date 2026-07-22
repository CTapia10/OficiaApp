using OficiaApp.Domain.Common;

namespace OficiaApp.Domain.Entities;

public class User : BaseEntity
{
    public string Username { get; private set; } = null!;
    public string PasswordHash { get; private set; } = null!;
    public string Email { get; private set; } = null!;
    public ClientProfile? ClientProfile { get; private set; }
    public ProfessionalProfile? ProfessionalProfile { get; private set; }

    public User(string username, string passwordHash, string email) : base()
    {
        Username = username;
        PasswordHash = passwordHash;
        Email = email;
    }

    // Required by EF Core materialization
    private User() : base()
    {
    }

    public void SetProfessionalProfile(ProfessionalProfile professionalProfile)
    {
        ProfessionalProfile = professionalProfile;
    }

    public void SetClientProfile(ClientProfile clientProfile)
    {
        ClientProfile = clientProfile;
    }
}
