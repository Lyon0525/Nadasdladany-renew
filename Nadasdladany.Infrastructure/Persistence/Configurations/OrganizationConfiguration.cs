using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Infrastructure.Persistence.Configurations;

public class OrganizationConfiguration : IEntityTypeConfiguration<Organization>
{
    public void Configure(EntityTypeBuilder<Organization> builder)
    {
        builder.HasIndex(o => o.Slug).IsUnique();
        builder.Property(o => o.Name).HasMaxLength(200).IsRequired();
        builder.Property(o => o.Slug).HasMaxLength(220).IsRequired();
        builder.Property(o => o.LeaderName).HasMaxLength(150);
        builder.Property(o => o.Address).HasMaxLength(255);
        builder.Property(o => o.PhoneNumber).HasMaxLength(50);
        builder.Property(o => o.Email).HasMaxLength(100);
    }
}