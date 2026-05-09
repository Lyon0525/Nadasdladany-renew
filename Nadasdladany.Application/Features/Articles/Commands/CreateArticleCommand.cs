using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.Articles.Commands;

public record CreateArticleCommand : IRequest<int>
{
    public required string Title { get; init; }
    public required string Content { get; init; }
    public string? Excerpt { get; init; }
    public int CategoryId { get; init; }
    public IFormFile? Image { get; init; }
}

public class CreateArticleCommandValidator : AbstractValidator<CreateArticleCommand>
{
    public CreateArticleCommandValidator()
    {
        RuleFor(v => v.Title).MaximumLength(200).NotEmpty();
        RuleFor(v => v.Content).NotEmpty();
        RuleFor(v => v.CategoryId).NotEmpty();
    }
}

public class CreateArticleCommandHandler : IRequestHandler<CreateArticleCommand, int>
{
    private readonly IApplicationDbContext _context;
    private readonly ISlugService _slugService;
    private readonly IFileService _fileService;

    public CreateArticleCommandHandler(IApplicationDbContext context, ISlugService slugService, IFileService fileService)
    {
        _context = context;
        _slugService = slugService;
        _fileService = fileService;
    }

    public async Task<int> Handle(CreateArticleCommand request, CancellationToken cancellationToken)
    {
        string? imageUrl = await _fileService.UploadFileAsync(request.Image, "articles");

        var entity = new Article
        {
            Title = request.Title,
            Content = request.Content,
            Excerpt = request.Excerpt,
            CategoryId = request.CategoryId,
            FeaturedImageUrl = imageUrl,
            Slug = _slugService.GenerateSlug(request.Title),
            PublishedDate = DateTime.UtcNow
        };

        _context.Articles.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}