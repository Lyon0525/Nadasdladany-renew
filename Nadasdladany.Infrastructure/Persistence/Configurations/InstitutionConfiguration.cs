using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Infrastructure.Persistence.Configurations;

public class InstitutionConfiguration : IEntityTypeConfiguration<Institution>
{
    public void Configure(EntityTypeBuilder<Institution> builder)
    {
        builder.HasIndex(i => i.Slug).IsUnique();
        builder.Property(i => i.Name).HasMaxLength(150).IsRequired();
        builder.Property(i => i.Address).HasMaxLength(255);
        builder.Property(i => i.Slug).HasMaxLength(160);
    }
}