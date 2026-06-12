using FluentValidation;
using MediatR;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.PublicDataRequests.Commands;

public record CreateDataRequestCommand : IRequest<int>
{
    public required string ApplicantName { get; init; }
    public required string ApplicantEmail { get; init; }
    public string? ApplicantPhone { get; init; }
    public required string RequestedDataDescription { get; init; }
}

public class CreateDataRequestCommandValidator : AbstractValidator<CreateDataRequestCommand>
{
    public CreateDataRequestCommandValidator()
    {
        RuleFor(v => v.ApplicantName).NotEmpty().MaximumLength(150);
        RuleFor(v => v.ApplicantEmail).NotEmpty().EmailAddress().MaximumLength(150);
        RuleFor(v => v.RequestedDataDescription).NotEmpty();
    }
}

public class CreateDataRequestCommandHandler : IRequestHandler<CreateDataRequestCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateDataRequestCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateDataRequestCommand request, CancellationToken cancellationToken)
    {
        var entity = new PublicDataRequest
        {
            ApplicantName = request.ApplicantName,
            ApplicantEmail = request.ApplicantEmail,
            ApplicantPhone = request.ApplicantPhone,
            RequestedDataDescription = request.RequestedDataDescription,
            IsProcessed = false
        };

        _context.PublicDataRequests.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}