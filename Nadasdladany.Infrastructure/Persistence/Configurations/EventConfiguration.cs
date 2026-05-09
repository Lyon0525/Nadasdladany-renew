using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Infrastructure.Persistence.Configurations;

public class EventConfiguration : IEntityTypeConfiguration<Event>
{
    public void Configure(EntityTypeBuilder<Event> builder)
    {
        builder.HasIndex(e => e.Slug).IsUnique();
        builder.Property(e => e.Title).HasMaxLength(150).IsRequired();
        builder.Property(e => e.Location).HasMaxLength(200);
        builder.Property(e => e.Organizer).HasMaxLength(100);
        builder.Property(e => e.Slug).HasMaxLength(160);
    }
}