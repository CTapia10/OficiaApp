using OficiaApp.Application.DTOs;
using OficiaApp.Domain.Entities;
using OficiaApp.Domain.Repositories;

namespace OficiaApp.Application.Services
{
    public class ProfessionalProfileService : IProfessionalProfileService
    {
        private readonly IUserRepository _userRepository;
        private readonly ICategoryRepository _categoryRepository;
        public ProfessionalProfileService(IUserRepository userRepository, ICategoryRepository categoryRepository)
        {
            _userRepository = userRepository;
            _categoryRepository = categoryRepository;
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
            ProfessionalProfile professionalProfile = new ProfessionalProfile(userId, dto.Bio, dto.YearsOfExperience, dto.HourlyRate);
            user.SetProfessionalProfile(professionalProfile);
            await _userRepository.UpdateAsync(user);

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
        }

        public async Task<IEnumerable<ProfessionalResponseDto>> SearchProfessionalsAsync(Guid? categoryId, decimal? maxHourlyRate)
        {
            var users = await _userRepository.SearchProfessionalsAsync(categoryId, maxHourlyRate);
            return users.Select(u => new ProfessionalResponseDto(
            u.Id,
            u.Username,
            u.ProfessionalProfile!.Bio,
            u.ProfessionalProfile.YearsOfExperience,
            u.ProfessionalProfile.HourlyRate,
            u.ProfessionalProfile.Categories.Select(c => c.Name) // Transforma la colección de Entidades en una colección de Strings
        ));
        }
    }
}