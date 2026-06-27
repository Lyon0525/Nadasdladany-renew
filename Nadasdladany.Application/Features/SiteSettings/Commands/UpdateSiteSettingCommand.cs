using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.SiteSettings.Commands;

public record UpdateSiteSettingCommand : IRequest
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
    public string? CommitteeText { get; init; }
    public string? ContactAddress { get; init; }
    public string? ContactEmail { get; init; }
    public string? ContactPhone { get; init; }
    public string? HostingProviderText { get; init; }
    public string? ImpressumText { get; init; }
    public string? GdprText { get; init; }
    public string? AccessibilityText { get; init; }
}

public class UpdateSiteSettingCommandHandler(IApplicationDbContext context, IFileService fileService) : IRequestHandler<UpdateSiteSettingCommand>
{
    public async Task Handle(UpdateSiteSettingCommand request, CancellationToken cancellationToken)
    {
        var entity = await context.SiteSettings.FirstOrDefaultAsync(cancellationToken);

        if (entity == null)
        {
            entity = new SiteSetting
            {
                MayorName = request.MayorName,
                WelcomeTitle = request.WelcomeTitle,
                WelcomeText = request.WelcomeText,
                HistoryText = request.HistoryText,
                CoatOfArmsText = request.CoatOfArmsText,
                LandmarksText = request.LandmarksText,
                CommitteeText = request.CommitteeText,
                ContactAddress = request.ContactAddress,
                ContactEmail = request.ContactEmail,
                ContactPhone = request.ContactPhone,
                ImpressumText = request.ImpressumText ?? string.Empty,
                GdprText = request.GdprText ?? string.Empty,
                AccessibilityText = request.AccessibilityText ?? string.Empty,
                HostingProviderText = request.HostingProviderText ?? string.Empty
            };
            context.SiteSettings.Add(entity);
        }
        else
        {
            entity.MayorName = request.MayorName;
            entity.WelcomeTitle = request.WelcomeTitle;
            entity.WelcomeText = request.WelcomeText;
            entity.HistoryText = request.HistoryText;
            entity.CoatOfArmsText = request.CoatOfArmsText;
            entity.LandmarksText = request.LandmarksText;
            entity.CommitteeText = request.CommitteeText;
            entity.ContactAddress = request.ContactAddress;
            entity.ContactEmail = request.ContactEmail;
            entity.ContactPhone = request.ContactPhone;
            entity.ImpressumText = request.ImpressumText ?? string.Empty;
            entity.GdprText = request.GdprText ?? string.Empty;
            entity.AccessibilityText = request.AccessibilityText ?? string.Empty;
        }

        if (request.MayorImage != null)
        {
            if (!string.IsNullOrEmpty(entity.MayorImageUrl))
                fileService.DeleteFile(entity.MayorImageUrl);

            entity.MayorImageUrl = await fileService.UploadFileAsync(request.MayorImage, "settings");
        }

        if (request.CoatOfArmsImage != null)
        {
            if (!string.IsNullOrEmpty(entity.CoatOfArmsImageUrl))
                fileService.DeleteFile(entity.CoatOfArmsImageUrl);

            entity.CoatOfArmsImageUrl = await fileService.UploadFileAsync(request.CoatOfArmsImage, "settings");
        }

        await context.SaveChangesAsync(cancellationToken);
    }
}