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

public class CreateAlbumCommandHandler : IRequestHandler<CreateAlbumCommand, int>
{
    private readonly IApplicationDbContext _context;
    private readonly ISlugService _slugService;
    private readonly IFileService _fileService;

    public CreateAlbumCommandHandler(IApplicationDbContext context, ISlugService slugService, IFileService fileService)
    {
        _context = context;
        _slugService = slugService;
        _fileService = fileService;
    }

    public async Task<int> Handle(CreateAlbumCommand request, CancellationToken cancellationToken)
    {
        var entity = new GalleryAlbum
        {
            Title = request.Name,
            Description = request.Description,
            Slug = _slugService.GenerateSlug(request.Name),
            IsPublished = true
        };

        _context.GalleryAlbums.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);

        if (request.CoverImage != null)
        {
            string? imageUrl = await _fileService.UploadFileAsync(request.CoverImage, "gallery");
            if (!string.IsNullOrEmpty(imageUrl))
            {
                _context.GalleryImages.Add(new GalleryImage
                {
                    ImageUrl = imageUrl,
                    ThumbnailUrl = imageUrl,
                    Title = "Borítókép",
                    GalleryAlbumId = entity.Id,
                    IsPublished = true,
                    DisplayOrder = 0
                });
                await _context.SaveChangesAsync(cancellationToken);
            }
        }

        return entity.Id;
    }
}