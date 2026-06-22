using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
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
    public IFormFile? Image { get; init; }
}

public class CreateEventCommandValidator : AbstractValidator<CreateEventCommand>
{
    public CreateEventCommandValidator()
    {
        RuleFor(v => v.Title).MaximumLength(150).NotEmpty();
        RuleFor(v => v.StartDate).NotEmpty();
        RuleFor(v => v.EndDate)
            .GreaterThanOrEqualTo(v => v.StartDate)
            .When(v => v.EndDate.HasValue)
            .WithMessage("A befejezés dátuma nem lehet korábbi a kezdésnél.");
    }
}

public class CreateEventCommandHandler : IRequestHandler<CreateEventCommand, int>
{
    private readonly IApplicationDbContext _context;
    private readonly ISlugService _slugService;
    private readonly IFileService _fileService; // 🌟 ÚJ: Fájlkezelő szerviz

    public CreateEventCommandHandler(IApplicationDbContext context, ISlugService slugService, IFileService fileService)
    {
        _context = context;
        _slugService = slugService;
        _fileService = fileService;
    }

    public async Task<int> Handle(CreateEventCommand request, CancellationToken cancellationToken)
    {
        var entity = new Event
        {
            Title = request.Title,
            Slug = _slugService.GenerateSlug(request.Title),
            Description = request.Description,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            Location = request.Location,
            IsAllDay = request.IsAllDay,
            Organizer = request.Organizer,
            ContactInfo = request.ContactInfo,
            EventUrl = request.EventUrl
        };

        if (request.Image != null)
        {
            entity.ImageUrl = await _fileService.UploadFileAsync(request.Image, "events");
        }

        _context.Events.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}