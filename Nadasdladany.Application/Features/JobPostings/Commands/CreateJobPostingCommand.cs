using FluentValidation;
using MediatR;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.JobPostings.Commands;

public record CreateJobPostingCommand : IRequest<int>
{
    public required string Title { get; init; }
    public required string Content { get; init; }
    public string? Excerpt { get; init; }
    public string? Department { get; init; }
    public string? Location { get; init; }
    public string? EmploymentType { get; init; }
    public DateTime? ApplicationDeadline { get; init; }
}

public class CreateJobPostingCommandValidator : AbstractValidator<CreateJobPostingCommand>
{
    public CreateJobPostingCommandValidator()
    {
        RuleFor(v => v.Title).MaximumLength(200).NotEmpty();
        RuleFor(v => v.Content).NotEmpty();
    }
}

public class CreateJobPostingCommandHandler : IRequestHandler<CreateJobPostingCommand, int>
{
    private readonly IApplicationDbContext _context;
    private readonly ISlugService _slugService;

    public CreateJobPostingCommandHandler(IApplicationDbContext context, ISlugService slugService)
    {
        _context = context;
        _slugService = slugService;
    }

    public async Task<int> Handle(CreateJobPostingCommand request, CancellationToken cancellationToken)
    {
        var entity = new JobPosting
        {
            Title = request.Title,
            Content = request.Content,
            Excerpt = request.Excerpt,
            Department = request.Department,
            Location = request.Location,
            EmploymentType = request.EmploymentType,
            ApplicationDeadline = request.ApplicationDeadline,
            Slug = _slugService.GenerateSlug(request.Title),
            IsActive = true
        };

        _context.JobPostings.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}