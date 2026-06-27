using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.Gallery.Commands;

public record UploadImageCommand : IRequest<int>
{
    public required IFormFile File { get; init; }
    public int AlbumId { get; init; }
    public string? Title { get; init; }
    public string? AltText { get; init; }
}

public class UploadImageCommandValidator : AbstractValidator<UploadImageCommand>
{
    public UploadImageCommandValidator()
    {
        RuleFor(v => v.File).NotNull();
        RuleFor(v => v.AlbumId).NotEmpty();
    }
}

public class UploadImageCommandHandler(IApplicationDbContext context, IFileService fileService) : IRequestHandler<UploadImageCommand, int>
{
    public async Task<int> Handle(UploadImageCommand request, CancellationToken cancellationToken)
    {
        string? imageUrl = await fileService.UploadFileAsync(request.File, "gallery");

        if (string.IsNullOrEmpty(imageUrl))
            throw new Exception("Image upload failed.");

        var entity = new GalleryImage
        {
            ImageUrl = imageUrl,
            ThumbnailUrl = imageUrl,
            Title = request.Title,
            AltText = request.AltText,
            GalleryAlbumId = request.AlbumId,
            IsPublished = true,
            DisplayOrder = 0
        };

        context.GalleryImages.Add(entity);
        await context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}