using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.SiteSettings.Commands;

public record UpdateSiteSettingCommand : IRequest<int>
{
    public int Id { get; init; }
    public required string MayorName { get; init; }
    public required string WelcomeTitle { get; init; }
    public required string WelcomeText { get; init; }
    public IFormFile? MayorImage { get; init; }
    public required string HistoryText { get; init; }
    public required string CoatOfArmsText { get; init; }
    public IFormFile? CoatOfArmsImage { get; init; }
    public required string LandmarksText { get; init; }
}

public class UpdateSiteSettingCommandHandler : IRequestHandler<UpdateSiteSettingCommand, int>
{
    private readonly IApplicationDbContext _context;
    private readonly IFileService _fileService;

    public UpdateSiteSettingCommandHandler(IApplicationDbContext context, IFileService fileService)
    {
        _context = context;
        _fileService = fileService;
    }

    public async Task<int> Handle(UpdateSiteSettingCommand request, CancellationToken cancellationToken)
    {
        var settings = await _context.SiteSettings.FirstOrDefaultAsync(cancellationToken);

        bool isNew = false;
        if (settings == null)
        {
            settings = new SiteSetting();
            isNew = true;
        }

        settings.MayorName = request.MayorName;
        settings.WelcomeTitle = request.WelcomeTitle;
        settings.WelcomeText = request.WelcomeText;
        settings.HistoryText = request.HistoryText;
        settings.CoatOfArmsText = request.CoatOfArmsText;
        settings.LandmarksText = request.LandmarksText;

        if (request.MayorImage != null)
        {
            if (!string.IsNullOrEmpty(settings.MayorImageUrl))
            {
                _fileService.DeleteFile(settings.MayorImageUrl);
            }

            settings.MayorImageUrl = await _fileService.UploadFileAsync(request.MayorImage, "mayor");
        }

        if (request.CoatOfArmsImage != null)
        {
            if (!string.IsNullOrEmpty(settings.CoatOfArmsImageUrl))
            {
                _fileService.DeleteFile(settings.CoatOfArmsImageUrl);
            }

            settings.CoatOfArmsImageUrl = await _fileService.UploadFileAsync(request.CoatOfArmsImage, "branding");
        }

        if (isNew)
        {
            _context.SiteSettings.Add(settings);
        }

        await _context.SaveChangesAsync(cancellationToken);

        return settings.Id;
    }
}