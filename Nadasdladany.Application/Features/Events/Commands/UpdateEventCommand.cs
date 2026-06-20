using FluentValidation;
using MediatR;
using Nadasdladany.Application.Common.Exceptions;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.Events.Commands;

public record UpdateEventCommand : IRequest
{
    public int Id { get; init; }
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

public class UpdateEventCommandValidator : AbstractValidator<UpdateEventCommand>
{
    public UpdateEventCommandValidator()
    {
        RuleFor(v => v.Title).MaximumLength(150).NotEmpty();
        RuleFor(v => v.StartDate).NotEmpty();
        RuleFor(v => v.EndDate)
            .GreaterThanOrEqualTo(v => v.StartDate)
            .When(v => v.EndDate.HasValue)
            .WithMessage("A befejezés dátuma nem lehet korábbi a kezdésnél.");
    }
}

public class UpdateEventCommandHandler : IRequestHandler<UpdateEventCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly ISlugService _slugService;

    public UpdateEventCommandHandler(IApplicationDbContext context, ISlugService slugService)
    {
        _context = context;
        _slugService = slugService;
    }

    public async Task Handle(UpdateEventCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Events.FindAsync(new object[] { request.Id }, cancellationToken);
        if (entity == null) throw new NotFoundException(nameof(Event), request.Id);

        entity.Title = request.Title;
        entity.Description = request.Description;
        entity.StartDate = request.StartDate;
        entity.EndDate = request.EndDate;
        entity.Location = request.Location;
        entity.IsAllDay = request.IsAllDay;
        entity.Organizer = request.Organizer;
        entity.ContactInfo = request.ContactInfo;
        entity.EventUrl = request.EventUrl;
        entity.Slug = _slugService.GenerateSlug(request.Title);

        await _context.SaveChangesAsync(cancellationToken);
    }
}