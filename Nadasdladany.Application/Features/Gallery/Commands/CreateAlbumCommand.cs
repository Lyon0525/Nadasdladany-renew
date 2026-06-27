using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.Gallery.Commands;

public record CreateAlbumCommand : IRequest<int>
{
    public required string Name { get; init; }
    public string? Description { get; init; }
    public IFormFile? CoverImage { get; init; }
}

public class CreateAlbumCommandValidator : AbstractValidator<CreateAlbumCommand>
{
    public CreateAlbumCommandValidator()
    {
        RuleFor(v => v.Name).NotEmpty().MaximumLength(100);
    }
}

public class CreateAlbumCommandHandler(IApplicationDbContext context, ISlugService slugService, IFileService fileService) : IRequestHandler<CreateAlbumCommand, int>
{
    public async Task<int> Handle(CreateAlbumCommand request, CancellationToken cancellationToken)
    {
        var entity = new GalleryAlbum
        {
            Title = request.Name,
            Description = request.Description,
            Slug = slugService.GenerateSlug(request.Name),
            IsPublished = true
        };

        context.GalleryAlbums.Add(entity);
        await context.SaveChangesAsync(cancellationToken);

        if (request.CoverImage != null)
        {
            string? imageUrl = await fileService.UploadFileAsync(request.CoverImage, "gallery");
            if (!string.IsNullOrEmpty(imageUrl))
            {
                context.GalleryImages.Add(new GalleryImage
                {
                    ImageUrl = imageUrl,
                    ThumbnailUrl = imageUrl,
                    Title = "Borítókép",
                    GalleryAlbumId = entity.Id,
                    IsPublished = true,
                    DisplayOrder = 0
                });
                await context.SaveChangesAsync(cancellationToken);
            }
        }

        return entity.Id;
    }
}