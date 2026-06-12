using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Infrastructure.Persistence.Configurations;

public class PublicDataRequestConfiguration : IEntityTypeConfiguration<PublicDataRequest>
{
    public void Configure(EntityTypeBuilder<PublicDataRequest> builder)
    {
        builder.Property(r => r.ApplicantName).HasMaxLength(150).IsRequired();
        builder.Property(r => r.ApplicantEmail).HasMaxLength(150).IsRequired();
        builder.Property(r => r.ApplicantPhone).HasMaxLength(50);
        builder.Property(r => r.RequestedDataDescription).IsRequired();
        builder.Property(r => r.InternalNotes).HasMaxLength(1000);
    }
}