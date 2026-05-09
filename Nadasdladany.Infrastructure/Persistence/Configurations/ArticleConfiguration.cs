using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Infrastructure.Persistence.Configurations;

public class ArticleConfiguration : IEntityTypeConfiguration<Article>
{
    public void Configure(EntityTypeBuilder<Article> builder)
    {
        builder.HasIndex(a => a.Slug).IsUnique();

        builder.Property(a => a.Title).HasMaxLength(200).IsRequired();
        builder.Property(a => a.Slug).HasMaxLength(250).IsRequired();
        builder.Property(a => a.Content).IsRequired();
        builder.Property(a => a.Author).HasMaxLength(100);
        builder.Property(a => a.Excerpt).HasMaxLength(500);

        builder.HasOne(a => a.Category)
               .WithMany(c => c.Articles)
               .HasForeignKey(a => a.CategoryId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}