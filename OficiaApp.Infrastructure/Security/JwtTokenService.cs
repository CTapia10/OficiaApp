using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using OficiaApp.Application.Ports.Out;
using OficiaApp.Application.Settings;
using OficiaApp.Domain.Entities;

namespace OficiaApp.Infrastructure.Security;

public class JwtTokenService : ITokenService
{
    private readonly JwtSettings _jwtSettings;

    public JwtTokenService(IOptions<JwtSettings> jwtSettings)
    {
        _jwtSettings = jwtSettings.Value;
    }

    public string GenerateToken(User user)
    {
        if (string.IsNullOrWhiteSpace(_jwtSettings.SecretKey))
        {
            throw new InvalidOperationException("JWT SecretKey is missing.");
        }

        if (string.IsNullOrWhiteSpace(_jwtSettings.Issuer))
        {
            throw new InvalidOperationException("JWT Issuer is missing.");
        }

        if (string.IsNullOrWhiteSpace(_jwtSettings.Audience))
        {
            throw new InvalidOperationException("JWT Audience is missing.");
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Username)
        };

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationInMinutes),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
