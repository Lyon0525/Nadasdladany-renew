using MediatR;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Features.SiteSettings.DTOs;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.SiteSettings.Queries;

public record GetSiteSettingQuery : IRequest<SiteSettingDto>;

public class GetSiteSettingQueryHandler : IRequestHandler<GetSiteSettingQuery, SiteSettingDto>
{
    private readonly IApplicationDbContext _context;

    public GetSiteSettingQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<SiteSettingDto> Handle(GetSiteSettingQuery request, CancellationToken cancellationToken)
    {
        var settings = await _context.SiteSettings.ToListAsync(cancellationToken);

        if (!settings.Any())
        {
            var defaults = new List<SiteSetting>
            {
                new() { SettingKey = "MayorName", SettingValue = "Pálfi Kristóf" },
                new() { SettingKey = "WelcomeTitle", SettingValue = "Polgármesteri Köszöntő" },
                new() { SettingKey = "WelcomeText", SettingValue = "Tisztelt Látogató! Szeretettel köszöntöm Önt Nádasdladány község hivatalos weboldalán..." },
                new() { SettingKey = "MayorImageUrl", SettingValue = "" }
            };

            _context.SiteSettings.AddRange(defaults);
            await _context.SaveChangesAsync(cancellationToken);
            settings = defaults;
        }

        return new SiteSettingDto
        {
            MayorName = settings.FirstOrDefault(s => s.SettingKey == "MayorName")?.SettingValue ?? "Pálfi Kristóf",
            WelcomeTitle = settings.FirstOrDefault(s => s.SettingKey == "WelcomeTitle")?.SettingValue ?? "Polgármesteri Köszöntő",
            WelcomeText = settings.FirstOrDefault(s => s.SettingKey == "WelcomeText")?.SettingValue ?? "",
            MayorImageUrl = settings.FirstOrDefault(s => s.SettingKey == "MayorImageUrl")?.SettingValue
        };
    }
}