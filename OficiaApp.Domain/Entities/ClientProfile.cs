using OficiaApp.Domain.Common;
using System;

namespace OficiaApp.Domain.Entities;

public class ClientProfile : BaseEntity
{
    public Guid UserId { get; private set; }
    public User User { get; private set; } = null!;
    public string PhoneNumber { get; private set; }
    public ClientProfile(Guid userId, string phoneNumber) : base()
    {
        UserId = userId;
        PhoneNumber = phoneNumber;
    }
}
