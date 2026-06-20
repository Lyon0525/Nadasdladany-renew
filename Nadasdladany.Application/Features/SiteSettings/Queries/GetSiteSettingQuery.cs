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
                LandmarksText = string.Empty
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
            LandmarksText = settings.LandmarksText
        };
    }
}