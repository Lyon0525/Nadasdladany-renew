using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.Projects.Commands;

public record CreateProjectCommand : IRequest<int>
{
    public required string Title { get; init; }
    public required string Content { get; init; }
    public string? Excerpt { get; init; }
    public string? ProjectCode { get; init; }
    public string? TotalFunding { get; init; }
    public string? SupportRate { get; init; }
    public IFormFile? Image { get; init; }
}

public class CreateProjectCommandValidator : AbstractValidator<CreateProjectCommand>
{
    public CreateProjectCommandValidator()
    {
        RuleFor(v => v.Title).MaximumLength(250).NotEmpty();
        RuleFor(v => v.Content).NotEmpty();
    }
}

public class CreateProjectCommandHandler : IRequestHandler<CreateProjectCommand, int>
{
    private readonly IApplicationDbContext _context;
    private readonly ISlugService _slugService;
    private readonly IFileService _fileService;

    public CreateProjectCommandHandler(IApplicationDbContext context, ISlugService slugService, IFileService fileService)
    {
        _context = context;
        _slugService = slugService;
        _fileService = fileService;
    }

    public async Task<int> Handle(CreateProjectCommand request, CancellationToken cancellationToken)
    {
        string? imageUrl = await _fileService.UploadFileAsync(request.Image, "projects");

        var entity = new Project
        {
            Title = request.Title,
            Content = request.Content,
            Excerpt = request.Excerpt,
            ProjectCode = request.ProjectCode,
            TotalFunding = request.TotalFunding,
            SupportRate = request.SupportRate,
            FeaturedImageUrl = imageUrl,
            Slug = _slugService.GenerateSlug(request.Title)
        };

        _context.Projects.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}