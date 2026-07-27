namespace OficiaApp.Api.Security;

/// <summary>
/// Centraliza el nombre y las opciones de la cookie que transporta el JWT,
/// para que Program.cs (lectura) y UsersController (escritura/borrado)
/// nunca queden desincronizados.
/// </summary>
public static class AuthCookies
{
    public const string AccessToken = "oficia_access_token";

    public static CookieOptions BuildOptions(DateTimeOffset expiresAt) => new()
    {
        HttpOnly = true,   // Inaccesible desde JavaScript -> mitiga robo de token por XSS.
        Secure = true,     // Solo viaja por HTTPS -> mitiga sniffing en redes inseguras.
        SameSite = SameSiteMode.None, // Frontend (http/https :3000) y Api (:7086) son
                                       // orígenes distintos (scheme distinto) para el
                                       // navegador; sin esto la cookie no se enviaría.
        Expires = expiresAt,
        Path = "/"
    };

    public static CookieOptions BuildDeleteOptions() => new()
    {
        HttpOnly = true,
        Secure = true,
        SameSite = SameSiteMode.None,
        Path = "/"
    };
}
