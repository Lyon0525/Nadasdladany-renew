using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;
using Nadasdladany.Domain.Enums;

namespace Nadasdladany.Application.Features.Municipality.Commands;

public record CreateRepresentativeCommand : IRequest<int>
{
    public required string Name { get; init; }
    public RepresentativeRole Role { get; init; }
    public string? CustomTitleOverride { get; init; }
    public string? Email { get; init; }
    public string? PhoneNumber { get; init; }
    public IFormFile? Image { get; init; }
    public string? Biography { get; init; }
    public int DisplayOrder { get; init; }
}

public class CreateRepresentativeCommandValidator : AbstractValidator<CreateRepresentativeCommand>
{
    public CreateRepresentativeCommandValidator()
    {
        RuleFor(v => v.Name).NotEmpty().MaximumLength(150);
        RuleFor(v => v.Email).EmailAddress().When(e => !string.IsNullOrEmpty(e.Email));
    }
}

public class CreateRepresentativeCommandHandler(IApplicationDbContext context, IFileService fileService) : IRequestHandler<CreateRepresentativeCommand, int>
{
    public async Task<int> Handle(CreateRepresentativeCommand request, CancellationToken cancellationToken)
    {
        string? imageUrl = await fileService.UploadFileAsync(request.Image, "reps");

        var entity = new Representative
        {
            Name = request.Name,
            Role = request.Role,
            CustomTitleOverride = request.CustomTitleOverride,
            Email = request.Email,
            PhoneNumber = request.PhoneNumber,
            ImageUrl = imageUrl,
            Biography = request.Biography,
            DisplayOrder = request.DisplayOrder,
            IsPublished = true
        };

        context.Representatives.Add(entity);
        await context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}