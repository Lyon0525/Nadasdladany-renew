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

public class CreateArticleCommandHandler(IApplicationDbContext context, ISlugService slugService, IFileService fileService) : IRequestHandler<CreateArticleCommand, int>
{
    public async Task<int> Handle(CreateArticleCommand request, CancellationToken cancellationToken)
    {
        string? imageUrl = await fileService.UploadFileAsync(request.Image, "articles");

        var entity = new Article
        {
            Title = request.Title,
            Content = request.Content,
            Excerpt = request.Excerpt,
            CategoryId = request.CategoryId,
            FeaturedImageUrl = imageUrl,
            Slug = slugService.GenerateSlug(request.Title),
            PublishedDate = DateTime.UtcNow,
            IsPublished = true
        };

        context.Articles.Add(entity);
        await context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}