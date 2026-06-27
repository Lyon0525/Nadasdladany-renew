using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.Institutions.Commands;

public record CreateInstitutionCommand : IRequest<int>
{
    public required string Name { get; init; }
    public string? Description { get; init; }
    public string? Address { get; init; }
    public string? PhoneNumber { get; init; }
    public string? Email { get; init; }
    public string? WebsiteUrl { get; init; }
    public IFormFile? Image { get; init; }
    public string? IconCssClass { get; init; }
    public int DisplayOrder { get; init; }
}

public class CreateInstitutionCommandValidator : AbstractValidator<CreateInstitutionCommand>
{
    public CreateInstitutionCommandValidator()
    {
        RuleFor(v => v.Name).MaximumLength(150).NotEmpty();
        RuleFor(v => v.Email).EmailAddress().When(v => !string.IsNullOrEmpty(v.Email));
    }
}

public class CreateInstitutionCommandHandler(IApplicationDbContext context, IFileService fileService, ISlugService slugService) : IRequestHandler<CreateInstitutionCommand, int>
{
    public async Task<int> Handle(CreateInstitutionCommand request, CancellationToken cancellationToken)
    {
        string? imageUrl = await fileService.UploadFileAsync(request.Image, "institutions");

        var entity = new Institution
        {
            Name = request.Name,
            Description = request.Description,
            Address = request.Address,
            PhoneNumber = request.PhoneNumber,
            Email = request.Email,
            WebsiteUrl = request.WebsiteUrl,
            ImageUrl = imageUrl,
            IconCssClass = request.IconCssClass,
            DisplayOrder = request.DisplayOrder,
            Slug = slugService.GenerateSlug(request.Name),
            IsPublished = true
        };

        context.Institutions.Add(entity);
        await context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}