using Nadasdladany.Application.Common.Mappings;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.Projects.DTOs;

public class ProjectDto : IMapFrom<Project>
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Excerpt { get; set; }
    public string Content { get; set; } = string.Empty;
    public string? FeaturedImageUrl { get; set; }
    public string? ProjectCode { get; set; }
    public string? TotalFunding { get; set; }
    public string? SupportRate { get; set; }
    public DateTime CreatedAt { get; set; }
}