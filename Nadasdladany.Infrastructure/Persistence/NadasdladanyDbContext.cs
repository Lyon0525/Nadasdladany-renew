using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Common;
using Nadasdladany.Domain.Entities;
using Nadasdladany.Infrastructure.Identity;
using Nadasdladany.Infrastructure.Services;
using System.Reflection;

namespace Nadasdladany.Infrastructure.Persistence;

public class NadasdladanyDbContext : IdentityDbContext<ApplicationUser>, IApplicationDbContext
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IDateTime _dateTime;

    public NadasdladanyDbContext(
        DbContextOptions<NadasdladanyDbContext> options,
        ICurrentUserService currentUserService,
        IDateTime dateTime)
        : base(options)
    {
        _currentUserService = currentUserService;
        _dateTime = dateTime;
    }

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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<BaseAuditableEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedAt = _dateTime.Now;
                    entry.Entity.CreatedBy = _currentUserService.UserId;
                    break;

                case EntityState.Modified:
                    entry.Entity.LastModifiedAt = _dateTime.Now;
                    entry.Entity.LastModifiedBy = _currentUserService.UserId;
                    break;
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
}