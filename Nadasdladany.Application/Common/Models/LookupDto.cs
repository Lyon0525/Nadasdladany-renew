using Nadasdladany.Application.Common.Mappings;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Common.Models;

/// <summary>
/// A simple DTO for lookup operations (e.g., dropdowns).
/// </summary>
public class LookupDto : IMapFrom<Category>, IMapFrom<DocumentCategory>
{
    public int Id { get; set; }
    public string? Name { get; set; }
}