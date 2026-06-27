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

public class CreateDataRequestCommandHandler(IApplicationDbContext context) : IRequestHandler<CreateDataRequestCommand, int>
{
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

        context.PublicDataRequests.Add(entity);
        await context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}