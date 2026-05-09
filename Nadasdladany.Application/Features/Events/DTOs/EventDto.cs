using Nadasdladany.Application.Common.Mappings;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.Events.DTOs;

public class EventDto : IMapFrom<Event>
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? Location { get; set; }
    public bool IsAllDay { get; set; }
    public string? Organizer { get; set; }
    public string? ContactInfo { get; set; }
    public string? EventUrl { get; set; }
    public string? Slug { get; set; }
}