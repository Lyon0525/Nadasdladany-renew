using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Infrastructure.Persistence.Configurations;

public class JobPostingConfiguration : IEntityTypeConfiguration<JobPosting>
{
    public void Configure(EntityTypeBuilder<JobPosting> builder)
    {
        builder.HasIndex(j => j.Slug).IsUnique();
        builder.Property(j => j.Title).HasMaxLength(200).IsRequired();
        builder.Property(j => j.Slug).HasMaxLength(250).IsRequired();
        builder.Property(j => j.Content).IsRequired();
        builder.Property(j => j.Excerpt).HasMaxLength(500);
        builder.Property(j => j.Department).HasMaxLength(150);
        builder.Property(j => j.Location).HasMaxLength(200);
        builder.Property(j => j.EmploymentType).HasMaxLength(100);
    }
}