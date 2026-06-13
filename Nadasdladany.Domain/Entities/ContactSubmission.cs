using Nadasdladany.Domain.Common;

namespace Nadasdladany.Domain.Entities;

public class ContactSubmission : BaseEntity
{
    public required string Name { get; set; }
    public required string Email { get; set; }
    public string? Subject { get; set; }
    public required string Message { get; set; }
    public DateTime SubmittedDate { get; set; } = DateTime.UtcNow;
    public bool IsRead { get; set; }
    public string? AdminNotes { get; set; }
}