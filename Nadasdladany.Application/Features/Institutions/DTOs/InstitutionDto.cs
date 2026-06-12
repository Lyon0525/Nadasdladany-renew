using Nadasdladany.Application.Common.Mappings;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.Institutions.DTOs;

public class InstitutionDto : IMapFrom<Institution>
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Content { get; set; }
    public string? LeaderName { get; set; }
    public string? OpeningHours { get; set; }
    public string? Address { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public string? WebsiteUrl { get; set; }
    public string? ImageUrl { get; set; }
    public string? IconCssClass { get; set; }
    public int DisplayOrder { get; set; }
}