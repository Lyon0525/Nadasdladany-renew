using Microsoft.EntityFrameworkCore;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Interfaces.Common;

/// <summary>
/// Contract for the application database context.
/// </summary>
public interface IApplicationDbContext
{
    DbSet<Article> Articles { get; }
    DbSet<Category> Categories { get; }
    DbSet<Event> Events { get; }
    DbSet<Document> Documents { get; }
    DbSet<DocumentCategory> DocumentCategories { get; }
    DbSet<Representative> Representatives { get; }
    DbSet<OfficeInfo> OfficeInfos { get; }
    DbSet<OfficeHourEntry> OfficeHourEntries { get; }
    DbSet<Institution> Institutions { get; }
    DbSet<GalleryAlbum> GalleryAlbums { get; }
    DbSet<GalleryImage> GalleryImages { get; }
    DbSet<UsefulLink> UsefulLinks { get; }
    DbSet<ContactSubmission> ContactSubmissions { get; }
    DbSet<SiteSetting> SiteSettings { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}