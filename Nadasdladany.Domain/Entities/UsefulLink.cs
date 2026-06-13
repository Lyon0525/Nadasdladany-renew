using Nadasdladany.Domain.Common;

namespace Nadasdladany.Domain.Entities;

public class UsefulLink : BaseEntity
{
    public required string Title { get; set; }
    public required string Url { get; set; }
    public string? Description { get; set; }
    public bool OpenInNewTab { get; set; } = true;
    public string? Category { get; set; }
    public bool IsPublished { get; set; } = true;
    public int DisplayOrder { get; set; }
}