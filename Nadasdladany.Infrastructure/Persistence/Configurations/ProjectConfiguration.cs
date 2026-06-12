using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Infrastructure.Persistence.Configurations;

public class ProjectConfiguration : IEntityTypeConfiguration<Project>
{
    public void Configure(EntityTypeBuilder<Project> builder)
    {
        builder.HasIndex(p => p.Slug).IsUnique();

        builder.Property(p => p.Title).HasMaxLength(250).IsRequired();
        builder.Property(p => p.Slug).HasMaxLength(280).IsRequired();
        builder.Property(p => p.Content).IsRequired();
        builder.Property(p => p.Excerpt).HasMaxLength(500);
        builder.Property(p => p.ProjectCode).HasMaxLength(100);
        builder.Property(p => p.TotalFunding).HasMaxLength(100);
        builder.Property(p => p.SupportRate).HasMaxLength(50);
    }
}