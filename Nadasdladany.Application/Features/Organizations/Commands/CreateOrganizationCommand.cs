using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;
using Nadasdladany.Domain.Enums;

namespace Nadasdladany.Application.Features.Organizations.Commands;

public record CreateOrganizationCommand : IRequest<int>
{
    public required string Name { get; init; }
    public string? Description { get; init; }
    public string? LeaderName { get; init; }
    public string? Address { get; init; }
    public string? PhoneNumber { get; init; }
    public string? Email { get; init; }
    public string? WebsiteUrl { get; init; }
    public OrganizationType Type { get; init; }
    public IFormFile? Image { get; init; }
    public int DisplayOrder { get; init; }
}

public class CreateOrganizationCommandValidator : AbstractValidator<CreateOrganizationCommand>
{
    public CreateOrganizationCommandValidator()
    {
        RuleFor(v => v.Name).NotEmpty().MaximumLength(200);
    }
}

public class CreateOrganizationCommandHandler(IApplicationDbContext context, IFileService fileService, ISlugService slugService) : IRequestHandler<CreateOrganizationCommand, int>
{
    public async Task<int> Handle(CreateOrganizationCommand request, CancellationToken cancellationToken)
    {
        string? imageUrl = await fileService.UploadFileAsync(request.Image, "organizations");

        var entity = new Organization
        {
            Name = request.Name,
            Description = request.Description,
            LeaderName = request.LeaderName,
            Address = request.Address,
            PhoneNumber = request.PhoneNumber,
            Email = request.Email,
            WebsiteUrl = request.WebsiteUrl,
            Type = request.Type,
            ImageUrl = imageUrl,
            DisplayOrder = request.DisplayOrder,
            Slug = slugService.GenerateSlug(request.Name)
        };

        context.Organizations.Add(entity);
        await context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}