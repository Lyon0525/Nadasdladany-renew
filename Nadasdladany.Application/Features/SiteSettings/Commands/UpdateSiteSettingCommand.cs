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
}

public class UpdateSiteSettingCommandHandler : IRequestHandler<UpdateSiteSettingCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IFileService _fileService;

    public UpdateSiteSettingCommandHandler(IApplicationDbContext context, IFileService fileService)
    {
        _context = context;
        _fileService = fileService;
    }

    public async Task Handle(UpdateSiteSettingCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.SiteSettings.FirstOrDefaultAsync(cancellationToken);

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
                ContactPhone = request.ContactPhone
            };
            _context.SiteSettings.Add(entity);
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
        }

        if (request.MayorImage != null)
        {
            if (!string.IsNullOrEmpty(entity.MayorImageUrl))
                _fileService.DeleteFile(entity.MayorImageUrl);

            entity.MayorImageUrl = await _fileService.UploadFileAsync(request.MayorImage, "settings");
        }

        if (request.CoatOfArmsImage != null)
        {
            if (!string.IsNullOrEmpty(entity.CoatOfArmsImageUrl))
                _fileService.DeleteFile(entity.CoatOfArmsImageUrl);

            entity.CoatOfArmsImageUrl = await _fileService.UploadFileAsync(request.CoatOfArmsImage, "settings");
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}