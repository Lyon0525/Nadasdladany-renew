using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Nadasdladany.Application.Common.Exceptions;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.Articles.Commands;

public record UpdateArticleCommand : IRequest
{
    public int Id { get; init; }
    public required string Title { get; init; }
    public required string Content { get; init; }
    public string? Excerpt { get; init; }
    public int CategoryId { get; init; }
    public IFormFile? Image { get; init; }
}

public class UpdateArticleCommandValidator : AbstractValidator<UpdateArticleCommand>
{
    public UpdateArticleCommandValidator()
    {
        RuleFor(v => v.Title).MaximumLength(200).NotEmpty();
        RuleFor(v => v.Content).NotEmpty();
    }
}

public class UpdateArticleCommandHandler(IApplicationDbContext context, ISlugService slugService, IFileService fileService) : IRequestHandler<UpdateArticleCommand>
{
    public async Task Handle(UpdateArticleCommand request, CancellationToken cancellationToken)
    {
        var entity = await context.Articles.FindAsync(new object[] { request.Id }, cancellationToken);

        if (entity == null)
            throw new NotFoundException(nameof(Article), request.Id);

        entity.Title = request.Title;
        entity.Content = request.Content;
        entity.Excerpt = request.Excerpt;
        entity.CategoryId = request.CategoryId;
        entity.Slug = slugService.GenerateSlug(request.Title);

        if (request.Image != null)
        {
            if (!string.IsNullOrEmpty(entity.FeaturedImageUrl))
                fileService.DeleteFile(entity.FeaturedImageUrl);

            entity.FeaturedImageUrl = await fileService.UploadFileAsync(request.Image, "articles");
        }

        await context.SaveChangesAsync(cancellationToken);
    }
}