using Nadasdladany.Application.Common.Mappings;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.PublicDataRequests.DTOs;

public class PublicDataRequestDto : IMapFrom<PublicDataRequest>
{
    public int Id { get; set; }
    public string ApplicantName { get; set; } = string.Empty;
    public string ApplicantEmail { get; set; } = string.Empty;
    public string? ApplicantPhone { get; set; }
    public string RequestedDataDescription { get; set; } = string.Empty;
    public bool IsProcessed { get; set; }
    public string? InternalNotes { get; set; }
    public DateTime CreatedAt { get; set; }
}