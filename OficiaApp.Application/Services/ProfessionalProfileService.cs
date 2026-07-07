using OficiaApp.Application.DTOs;
using OficiaApp.Domain.Entities;
using OficiaApp.Domain.Repositories;

namespace OficiaApp.Application.Services
{
    public class ProfessionalProfileService : IProfessionalProfileService
    {
        private readonly IUserRepository _userRepository;

        public ProfessionalProfileService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
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
    }
}