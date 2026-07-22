using OficiaApp.Application.DTOs;
using OficiaApp.Application.Ports.In;
using OficiaApp.Application.Ports.Out;
using OficiaApp.Domain.Entities;

namespace OficiaApp.Application.UseCases;

public class ProfessionalProfileService : IProfessionalProfileService
{
    private readonly IUserRepository _userRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ProfessionalProfileService(
        IUserRepository userRepository,
        ICategoryRepository categoryRepository,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _categoryRepository = categoryRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task CreateProfileAsync(Guid userId, CreateProfessionalProfileDto dto)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            throw new ArgumentException("User not found", nameof(userId));
        }
        if (user.ProfessionalProfile != null)
        {
            throw new InvalidOperationException("User already has a professional profile");
        }

        var professionalProfile = new ProfessionalProfile(userId, dto.Bio, dto.YearsOfExperience, dto.HourlyRate);
        user.SetProfessionalProfile(professionalProfile);
        await _userRepository.UpdateAsync(user);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task AddCategoryAsync(Guid userId, Guid categoryId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            throw new ArgumentException("User not found", nameof(userId));
        }
        if (user.ProfessionalProfile == null)
        {
            throw new InvalidOperationException("User does not have a professional profile");
        }

        var category = await _categoryRepository.GetByIdAsync(categoryId);
        if (category == null)
        {
            throw new ArgumentException("Category not found", nameof(categoryId));
        }

        user.ProfessionalProfile.AddCategory(category);
        await _userRepository.UpdateAsync(user);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<IEnumerable<ExploreProfessionalDto>> SearchProfessionalsAsync(Guid? categoryId, decimal? maxHourlyRate)
    {
        var users = await _userRepository.SearchProfessionalsAsync(categoryId, maxHourlyRate);
        return users.Select(u => new ExploreProfessionalDto(
            u.Id,
            u.ProfessionalProfile!.Id,
            u.Username,
            u.ProfessionalProfile.Bio,
            u.ProfessionalProfile.YearsOfExperience,
            u.ProfessionalProfile.HourlyRate,
            u.ProfessionalProfile.Categories.Select(c => new CategorySummaryDto(c.Id, c.Name))));
    }
}
