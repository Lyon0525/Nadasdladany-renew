using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Infrastructure.Persistence.Configurations;

public class DocumentConfiguration : IEntityTypeConfiguration<Document>
{
    public void Configure(EntityTypeBuilder<Document> builder)
    {
        builder.Property(d => d.Title).HasMaxLength(255).IsRequired();
        builder.Property(d => d.FilePath).HasMaxLength(500).IsRequired();
        builder.Property(d => d.FileType).HasMaxLength(100);

        builder.HasOne(d => d.DocumentCategory)
               .WithMany(c => c.Documents)
               .HasForeignKey(d => d.DocumentCategoryId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}