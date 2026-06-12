using Nadasdladany.Application.Common.Mappings;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.JobPostings.DTOs;

public class JobPostingDto : IMapFrom<JobPosting>
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Excerpt { get; set; }
    public string Content { get; set; } = string.Empty;
    public string? Department { get; set; }
    public string? Location { get; set; }
    public string? EmploymentType { get; set; }
    public DateTime? ApplicationDeadline { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}