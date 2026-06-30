using OficiaApp.Domain.Common;
using System;

namespace OficiaApp.Domain.Entities;

public class ProfessionalProfile : BaseEntity
{
	public Guid UserId { get; private set; }
	public User User { get; private set; } = null!;
	public string Bio { get; private set; }
	public int YearsOfExperience { get; private set; }
	public decimal HourlyRate { get; private set; }
    public ProfessionalProfile(Guid userId, string bio, int yearsOfExperience, decimal hourlyRate) : base()
	{
		UserId = userId;
		Bio = bio;
		YearsOfExperience = yearsOfExperience;
		HourlyRate = hourlyRate;
	}
}
