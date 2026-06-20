using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Infrastructure.Persistence.Configurations;

public class SiteSettingConfiguration : IEntityTypeConfiguration<SiteSetting>
{
    public void Configure(EntityTypeBuilder<SiteSetting> builder)
    {
        builder.HasKey(s => s.Id);

        builder.Property(s => s.MayorName)
            .HasMaxLength(150)
            .IsRequired();

        builder.Property(s => s.WelcomeTitle)
            .HasMaxLength(250)
            .IsRequired();

        builder.Property(s => s.WelcomeText)
            .IsRequired();

        builder.Property(s => s.HistoryText)
            .IsRequired();

        builder.Property(s => s.CoatOfArmsText)
            .IsRequired();

        builder.Property(s => s.LandmarksText)
            .IsRequired();
    }
}