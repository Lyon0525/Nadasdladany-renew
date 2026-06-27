using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Common;
using Nadasdladany.Domain.Entities;
using Nadasdladany.Infrastructure.Identity;
using System.Reflection;

namespace Nadasdladany.Infrastructure.Persistence;

public class NadasdladanyDbContext(
    DbContextOptions<NadasdladanyDbContext> options,
    ICurrentUserService currentUserService,
    IDateTime dateTime)
    : IdentityDbContext<ApplicationUser>(options), IApplicationDbContext
{
    public DbSet<Article> Articles => Set<Article>();
    public DbSet<JobPosting> JobPostings => Set<JobPosting>();
    public DbSet<NewsletterSubscriber> NewsletterSubscribers => Set<NewsletterSubscriber>();
    public DbSet<Organization> Organizations => Set<Organization>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<PublicDataRequest> PublicDataRequests => Set<PublicDataRequest>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<Event> Events => Set<Event>();
    public DbSet<Document> Documents => Set<Document>();
    public DbSet<DocumentCategory> DocumentCategories => Set<DocumentCategory>();
    public DbSet<Representative> Representatives => Set<Representative>();
    public DbSet<OfficeInfo> OfficeInfos => Set<OfficeInfo>();
    public DbSet<OfficeHourEntry> OfficeHourEntries => Set<OfficeHourEntry>();
    public DbSet<Institution> Institutions => Set<Institution>();
    public DbSet<GalleryAlbum> GalleryAlbums => Set<GalleryAlbum>();
    public DbSet<GalleryImage> GalleryImages => Set<GalleryImage>();
    public DbSet<UsefulLink> UsefulLinks => Set<UsefulLink>();
    public DbSet<ContactSubmission> ContactSubmissions => Set<ContactSubmission>();
    public DbSet<SiteSetting> SiteSettings => Set<SiteSetting>();
    public DbSet<OfficeSetting> OfficeSettings => Set<OfficeSetting>();
    public DbSet<OfficeStaff> OfficeStaff => Set<OfficeStaff>();
    public DbSet<ElectionResultEntity> Elections => Set<ElectionResultEntity>();
    public DbSet<VillageLocation> VillageLocations => Set<VillageLocation>();
    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }

    private void UpdateAuditableEntities()
    {
        foreach (var entry in ChangeTracker.Entries<BaseAuditableEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedAt = dateTime.Now;
                    entry.Entity.CreatedBy = currentUserService.UserId;
                    break;

                case EntityState.Modified:
                    entry.Entity.LastModifiedAt = dateTime.Now;
                    entry.Entity.LastModifiedBy = currentUserService.UserId;
                    break;
            }
        }
    }

    public override int SaveChanges()
    {
        UpdateAuditableEntities();
        return base.SaveChanges();
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateAuditableEntities();
        return await base.SaveChangesAsync(cancellationToken);
    }
}