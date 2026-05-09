using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Infrastructure.Persistence.Configurations;

public class GalleryAlbumConfiguration : IEntityTypeConfiguration<GalleryAlbum>
{
    public void Configure(EntityTypeBuilder<GalleryAlbum> builder)
    {
        builder.HasIndex(a => a.Slug).IsUnique();
        builder.Property(a => a.Title).HasMaxLength(100).IsRequired();
        builder.Property(a => a.Slug).HasMaxLength(110);

        builder.HasMany(a => a.Images)
               .WithOne(i => i.GalleryAlbum)
               .HasForeignKey(i => i.GalleryAlbumId)
               .OnDelete(DeleteBehavior.SetNull);
    }
}