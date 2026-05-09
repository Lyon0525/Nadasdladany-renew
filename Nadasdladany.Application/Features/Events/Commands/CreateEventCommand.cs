using FluentValidation;
using MediatR;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.Events.Commands;

public record CreateEventCommand : IRequest<int>
{
    public required string Title { get; init; }
    public string? Description { get; init; }
    public DateTime StartDate { get; init; }
    public DateTime? EndDate { get; init; }
    public string? Location { get; init; }
    public bool IsAllDay { get; init; }
    public string? Organizer { get; init; }
    public string? ContactInfo { get; init; }
    public string? EventUrl { get; init; }
}

public class CreateEventCommandValidator : AbstractValidator<CreateEventCommand>
{
    public CreateEventCommandValidator()
    {
        RuleFor(v => v.Title).MaximumLength(150).NotEmpty();
        RuleFor(v => v.StartDate).NotEmpty();

        // Üzleti szabály: A befejezés nem lehet a kezdés előtt
        RuleFor(v => v.EndDate)
            .GreaterThanOrEqualTo(v => v.StartDate)
                .When(v => v.EndDate.HasValue)
                .WithMessage("The end date cannot be earlier than the start date.");
    }
}

public class CreateEventCommandHandler : IRequestHandler<CreateEventCommand, int>
{
    private readonly IApplicationDbContext _context;
    private readonly ISlugService _slugService;

    public CreateEventCommandHandler(IApplicationDbContext context, ISlugService slugService)
    {
        _context = context;
        _slugService = slugService;
    }

    public async Task<int> Handle(CreateEventCommand request, CancellationToken cancellationToken)
    {
        var entity = new Event
        {
            Title = request.Title,
            Description = request.Description,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            Location = request.Location,
            IsAllDay = request.IsAllDay,
            Organizer = request.Organizer,
            ContactInfo = request.ContactInfo,
            EventUrl = request.EventUrl,
            IsPublished = true,
            Slug = _slugService.GenerateSlug(request.Title)
        };

        _context.Events.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}