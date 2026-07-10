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

	private readonly List<Category> _categories = new List<Category>();
	public IReadOnlyCollection<Category> Categories => _categories.AsReadOnly();
    public ProfessionalProfile(Guid userId, string bio, int yearsOfExperience, decimal hourlyRate) : base()
    {
        UserId = userId;
        Bio = bio;
        YearsOfExperience = yearsOfExperience;
        HourlyRate = hourlyRate;
    }
    public void AddCategory(Category category)
	{
		if (category == null)
		{
			throw new ArgumentNullException(nameof(category), "Category cannot be null.");
        }
		if (_categories.Contains(category))
        {
			return;
        }
        _categories.Add(category);
	}
}
