using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Infrastructure.Persistence.Configurations;

public class RepresentativeConfiguration : IEntityTypeConfiguration<Representative>
{
    public void Configure(EntityTypeBuilder<Representative> builder)
    {
        builder.Property(r => r.Name).HasMaxLength(150).IsRequired();
        builder.Property(r => r.CustomTitleOverride).HasMaxLength(200);
        builder.Property(r => r.Email).HasMaxLength(100);
        builder.Property(r => r.PhoneNumber).HasMaxLength(30);
    }
}