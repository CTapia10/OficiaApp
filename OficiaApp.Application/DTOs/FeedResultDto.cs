namespace OficiaApp.Application.DTOs;

public record FeedResultDto(
    IReadOnlyList<PostResponseDto> Items,
    DateTime? NextCursorCreatedAt,
    Guid? NextCursorId);
