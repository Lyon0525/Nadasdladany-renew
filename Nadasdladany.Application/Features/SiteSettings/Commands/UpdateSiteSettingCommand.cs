using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.SiteSettings.Commands;

public record UpdateSiteSettingCommand : IRequest<int>
{
    public required string MayorName { get; init; }
    public required string WelcomeTitle { get; init; }
    public required string WelcomeText { get; init; }
    public IFormFile? MayorImage { get; init; }
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
        var settings = await _context.SiteSettings.ToListAsync(cancellationToken);

        await SaveSettingAsync(settings, "MayorName", request.MayorName, cancellationToken);
        await SaveSettingAsync(settings, "WelcomeTitle", request.WelcomeTitle, cancellationToken);
        await SaveSettingAsync(settings, "WelcomeText", request.WelcomeText, cancellationToken);

        if (request.MayorImage != null)
        {
            var imgSetting = settings.FirstOrDefault(s => s.SettingKey == "MayorImageUrl");
            if (imgSetting != null && !string.IsNullOrEmpty(imgSetting.SettingValue))
            {
                _fileService.DeleteFile(imgSetting.SettingValue);
            }

            string newImageUrl = await _fileService.UploadFileAsync(request.MayorImage, "mayor");
            await SaveSettingAsync(settings, "MayorImageUrl", newImageUrl, cancellationToken);
        }

        await _context.SaveChangesAsync(cancellationToken);
        return 1;
    }

    private async Task SaveSettingAsync(List<SiteSetting> existingSettings, string key, string value, CancellationToken cancellationToken)
    {
        var setting = existingSettings.FirstOrDefault(s => s.SettingKey == key);
        if (setting != null)
        {
            setting.SettingValue = value;
        }
        else
        {
            var newSetting = new SiteSetting { SettingKey = key, SettingValue = value };
            _context.SiteSettings.Add(newSetting);
        }
    }
}