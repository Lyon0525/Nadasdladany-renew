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

public class UpdateProjectCommandHandler : IRequestHandler<UpdateProjectCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly ISlugService _slugService;
    private readonly IFileService _fileService;

    public UpdateProjectCommandHandler(IApplicationDbContext context, ISlugService slugService, IFileService fileService)
    {
        _context = context;
        _slugService = slugService;
        _fileService = fileService;
    }

    public async Task Handle(UpdateProjectCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Projects.FindAsync(new object[] { request.Id }, cancellationToken);
        if (entity == null) throw new NotFoundException(nameof(Project), request.Id);

        entity.Title = request.Title;
        entity.Content = request.Content;
        entity.Excerpt = request.Excerpt;
        entity.ProjectCode = request.ProjectCode;
        entity.TotalFunding = request.TotalFunding;
        entity.SupportRate = request.SupportRate;
        entity.Slug = _slugService.GenerateSlug(request.Title);

        if (request.Image != null)
        {
            if (!string.IsNullOrEmpty(entity.FeaturedImageUrl))
            {
                _fileService.DeleteFile(entity.FeaturedImageUrl);
            }
            entity.FeaturedImageUrl = await _fileService.UploadFileAsync(request.Image, "projects");
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}