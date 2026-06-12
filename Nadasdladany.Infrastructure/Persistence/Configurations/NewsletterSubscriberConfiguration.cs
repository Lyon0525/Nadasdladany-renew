using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Infrastructure.Persistence.Configurations;

public class NewsletterSubscriberConfiguration : IEntityTypeConfiguration<NewsletterSubscriber>
{
    public void Configure(EntityTypeBuilder<NewsletterSubscriber> builder)
    {
        builder.HasIndex(s => s.Email).IsUnique();
        builder.Property(s => s.Email).HasMaxLength(150).IsRequired();
        builder.Property(s => s.Name).HasMaxLength(100);
        builder.Property(s => s.UnsubscribeToken).HasMaxLength(100).IsRequired();
    }
}