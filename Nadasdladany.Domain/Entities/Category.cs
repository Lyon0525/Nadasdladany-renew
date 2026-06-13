using Nadasdladany.Domain.Common;

namespace Nadasdladany.Domain.Entities;

public class Category : BaseEntity
{
    public required string Name { get; set; }
    public required string Slug { get; set; }
    public string? Description { get; set; }
    public virtual ICollection<Article> Articles { get; set; } = new List<Article>();
}