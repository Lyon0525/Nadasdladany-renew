using Microsoft.EntityFrameworkCore;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Interfaces.Common;

public interface IApplicationDbContext
{
    DbSet<Organization> Organizations { get; }
    DbSet<Article> Articles { get; }
    DbSet<Project> Projects { get; }
    DbSet<Category> Categories { get; }
    DbSet<Event> Events { get; }
    DbSet<JobPosting> JobPostings { get; }
    DbSet<Document> Documents { get; }
    DbSet<DocumentCategory> DocumentCategories { get; }
    DbSet<PublicDataRequest> PublicDataRequests { get; }
    DbSet<NewsletterSubscriber> NewsletterSubscribers { get; }
    DbSet<Representative> Representatives { get; }
    DbSet<OfficeInfo> OfficeInfos { get; }
    DbSet<OfficeHourEntry> OfficeHourEntries { get; }
    DbSet<Institution> Institutions { get; }
    DbSet<GalleryAlbum> GalleryAlbums { get; }
    DbSet<GalleryImage> GalleryImages { get; }
    DbSet<UsefulLink> UsefulLinks { get; }
    DbSet<ContactSubmission> ContactSubmissions { get; }
    DbSet<SiteSetting> SiteSettings { get; }
    DbSet<OfficeSetting> OfficeSettings { get; }
    DbSet<OfficeStaff> OfficeStaff { get; }
    DbSet<ElectionResultEntity> Elections { get; }
    DbSet<VillageLocation> VillageLocations { get; }
    DbSet<ContactMessage> ContactMessages { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}