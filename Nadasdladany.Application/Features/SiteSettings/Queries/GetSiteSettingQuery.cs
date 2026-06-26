using MediatR;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Features.SiteSettings.DTOs;
using Nadasdladany.Application.Interfaces.Common;

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
        var settings = await _context.SiteSettings.FirstOrDefaultAsync(cancellationToken);

        if (settings == null)
        {
            return new SiteSettingDto
            {
                Id = 0,
                MayorName = string.Empty,
                WelcomeTitle = string.Empty,
                WelcomeText = string.Empty,
                HistoryText = string.Empty,
                CoatOfArmsText = string.Empty,
                LandmarksText = string.Empty,
                CommitteeText = string.Empty,
                ContactAddress = string.Empty,
                ContactEmail = string.Empty,
                ContactPhone = string.Empty,
                ImpressumText = string.Empty,
                GdprText = string.Empty,
                AccessibilityText = string.Empty,
                HostingProviderText = string.Empty
            };
        }

        return new SiteSettingDto
        {
            Id = settings.Id,
            MayorName = settings.MayorName,
            WelcomeTitle = settings.WelcomeTitle,
            WelcomeText = settings.WelcomeText,
            MayorImageUrl = settings.MayorImageUrl,
            HistoryText = settings.HistoryText,
            CoatOfArmsText = settings.CoatOfArmsText,
            CoatOfArmsImageUrl = settings.CoatOfArmsImageUrl,
            LandmarksText = settings.LandmarksText,
            CommitteeText = settings.CommitteeText,
            ContactAddress = settings.ContactAddress,
            ContactEmail = settings.ContactEmail,
            ContactPhone = settings.ContactPhone,
            ImpressumText = settings.ImpressumText,
            GdprText = settings.GdprText,
            AccessibilityText = settings.AccessibilityText,
            HostingProviderText = settings.HostingProviderText
        };
    }
}