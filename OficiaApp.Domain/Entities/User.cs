using System;
using OficiaApp.Domain.Common;

namespace OficiaApp.Domain.Entities;

public class User : BaseEntity
{
	public string Username { get; private set; }
	public string PasswordHash { get; private set; }
	public string Email { get; private set; }

    public User(string username, string passwordHash, string email) : base()
	{
		Username = username;
		PasswordHash = passwordHash;
		Email = email;
	}


}
