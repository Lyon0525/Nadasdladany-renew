using FluentValidation;
using MediatR;
using Nadasdladany.Application.Common.Exceptions;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.JobPostings.Commands;

public record UpdateJobPostingCommand : IRequest
{
    public int Id { get; init; }
    public required string Title { get; init; }
    public required string Content { get; init; }
    public string? Excerpt { get; init; }
    public string? Department { get; init; }
    public string? Location { get; init; }
    public string? EmploymentType { get; init; }
    public DateTime? ApplicationDeadline { get; init; }
}

public class UpdateJobPostingCommandValidator : AbstractValidator<UpdateJobPostingCommand>
{
    public UpdateJobPostingCommandValidator()
    {
        RuleFor(v => v.Title).MaximumLength(200).NotEmpty();
        RuleFor(v => v.Content).NotEmpty();
    }
}

public class UpdateJobPostingCommandHandler(IApplicationDbContext context, ISlugService slugService) : IRequestHandler<UpdateJobPostingCommand>
{
    public async Task Handle(UpdateJobPostingCommand request, CancellationToken cancellationToken)
    {
        var entity = await context.JobPostings.FindAsync(new object[] { request.Id }, cancellationToken);
        if (entity == null) throw new NotFoundException(nameof(JobPosting), request.Id);

        entity.Title = request.Title;
        entity.Content = request.Content;
        entity.Excerpt = request.Excerpt;
        entity.Department = request.Department;
        entity.Location = request.Location;
        entity.EmploymentType = request.EmploymentType;
        entity.ApplicationDeadline = request.ApplicationDeadline;
        entity.Slug = slugService.GenerateSlug(request.Title);

        await context.SaveChangesAsync(cancellationToken);
    }
}