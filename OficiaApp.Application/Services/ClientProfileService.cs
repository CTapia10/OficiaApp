using OficiaApp.Application.DTOs;
using OficiaApp.Domain.Entities;
using OficiaApp.Domain.Repositories;

namespace OficiaApp.Application.Services
{
    public class ClientProfileService : IClientProfileService
    {
        private readonly IUserRepository _userRepository;
        public ClientProfileService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }
        public async Task CreateClientProfileAsync(Guid userId, CreateClientProfileDto dto)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                throw new ArgumentException("User not found", nameof(userId));
            }
            if (user.ClientProfile != null)
            {
                throw new InvalidOperationException("User already has a client profile");
            }
            ClientProfile clientProfile = new ClientProfile(userId, dto.PhoneNumber);
            user.SetClientProfile(clientProfile);
            await _userRepository.UpdateAsync(user);

        }

    }
}
