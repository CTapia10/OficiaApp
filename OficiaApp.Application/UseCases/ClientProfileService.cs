using OficiaApp.Application.DTOs;
using OficiaApp.Application.Ports.In;
using OficiaApp.Application.Ports.Out;
using OficiaApp.Domain.Entities;

namespace OficiaApp.Application.UseCases;

public class ClientProfileService : IClientProfileService
{
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ClientProfileService(IUserRepository userRepository, IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
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

        var clientProfile = new ClientProfile(userId, dto.PhoneNumber);
        user.SetClientProfile(clientProfile);
        await _userRepository.UpdateAsync(user);
        await _unitOfWork.SaveChangesAsync();
    }
}
