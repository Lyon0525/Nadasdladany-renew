using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Nadasdladany.Application.Common.Exceptions;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;
using Nadasdladany.Domain.Enums;

namespace Nadasdladany.Application.Features.Municipality.Commands;

public record UpdateRepresentativeCommand : IRequest
{
    public int Id { get; init; }
    public required string Name { get; init; }
    public RepresentativeRole Role { get; init; }
    public string? CustomTitleOverride { get; init; }
    public string? Email { get; init; }
    public string? PhoneNumber { get; init; }
    public string? ReceptionHoursInfo { get; init; }
    public string? Biography { get; init; }
    public int DisplayOrder { get; init; }
    public IFormFile? Image { get; init; }
}

public class UpdateRepresentativeCommandValidator : AbstractValidator<UpdateRepresentativeCommand>
{
    public UpdateRepresentativeCommandValidator()
    {
        RuleFor(v => v.Name).MaximumLength(150).NotEmpty();
        RuleFor(v => v.Email).EmailAddress().When(e => !string.IsNullOrEmpty(e.Email));
    }
}

public class UpdateRepresentativeCommandHandler(IApplicationDbContext context, IFileService fileService) : IRequestHandler<UpdateRepresentativeCommand>
{
    public async Task Handle(UpdateRepresentativeCommand request, CancellationToken cancellationToken)
    {
        var entity = await context.Representatives.FindAsync(new object[] { request.Id }, cancellationToken);
        if (entity == null) throw new NotFoundException(nameof(Representative), request.Id);

        entity.Name = request.Name;
        entity.Role = request.Role;
        entity.CustomTitleOverride = request.CustomTitleOverride;
        entity.Email = request.Email;
        entity.PhoneNumber = request.PhoneNumber;
        entity.ReceptionHoursInfo = request.ReceptionHoursInfo;
        entity.Biography = request.Biography;
        entity.DisplayOrder = request.DisplayOrder;

        if (request.Image != null)
        {
            if (!string.IsNullOrEmpty(entity.ImageUrl))
            {
                fileService.DeleteFile(entity.ImageUrl);
            }
            entity.ImageUrl = await fileService.UploadFileAsync(request.Image, "reps");
        }

        await context.SaveChangesAsync(cancellationToken);
    }
}