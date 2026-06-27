using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Nadasdladany.Application.Common.Exceptions;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.Projects.Commands;

public record UpdateProjectCommand : IRequest
{
    public int Id { get; init; }
    public required string Title { get; init; }
    public required string Content { get; init; }
    public string? Excerpt { get; init; }
    public string? ProjectCode { get; init; }
    public string? TotalFunding { get; init; }
    public string? SupportRate { get; init; }
    public IFormFile? Image { get; init; }
}

public class UpdateProjectCommandValidator : AbstractValidator<UpdateProjectCommand>
{
    public UpdateProjectCommandValidator()
    {
        RuleFor(v => v.Title).MaximumLength(250).NotEmpty();
        RuleFor(v => v.Content).NotEmpty();
    }
}

public class UpdateProjectCommandHandler(IApplicationDbContext context, ISlugService slugService, IFileService fileService) : IRequestHandler<UpdateProjectCommand>
{
    public async Task Handle(UpdateProjectCommand request, CancellationToken cancellationToken)
    {
        var entity = await context.Projects.FindAsync(new object[] { request.Id }, cancellationToken);
        if (entity == null) throw new NotFoundException(nameof(Project), request.Id);

        entity.Title = request.Title;
        entity.Content = request.Content;
        entity.Excerpt = request.Excerpt;
        entity.ProjectCode = request.ProjectCode;
        entity.TotalFunding = request.TotalFunding;
        entity.SupportRate = request.SupportRate;
        entity.Slug = slugService.GenerateSlug(request.Title);

        if (request.Image != null)
        {
            if (!string.IsNullOrEmpty(entity.FeaturedImageUrl))
            {
                fileService.DeleteFile(entity.FeaturedImageUrl);
            }
            entity.FeaturedImageUrl = await fileService.UploadFileAsync(request.Image, "projects");
        }

        await context.SaveChangesAsync(cancellationToken);
    }
}