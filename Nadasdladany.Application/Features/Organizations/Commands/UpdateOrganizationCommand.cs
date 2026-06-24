using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Nadasdladany.Application.Common.Exceptions;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;
using Nadasdladany.Domain.Enums;

namespace Nadasdladany.Application.Features.Organizations.Commands;

public record UpdateOrganizationCommand : IRequest
{
    public int Id { get; init; }
    public required string Name { get; init; }
    public string? Description { get; init; }
    public string? LeaderName { get; init; }
    public string? Address { get; init; }
    public string? PhoneNumber { get; init; }
    public string? Email { get; init; }
    public string? WebsiteUrl { get; init; }
    public OrganizationType Type { get; init; }
    public int DisplayOrder { get; init; }
    public IFormFile? Image { get; init; }
}

public class UpdateOrganizationCommandValidator : AbstractValidator<UpdateOrganizationCommand>
{
    public UpdateOrganizationCommandValidator()
    {
        RuleFor(v => v.Name).NotEmpty().MaximumLength(200);
    }
}

public class UpdateOrganizationCommandHandler : IRequestHandler<UpdateOrganizationCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IFileService _fileService;
    private readonly ISlugService _slugService;

    public UpdateOrganizationCommandHandler(IApplicationDbContext context, IFileService fileService, ISlugService slugService)
    {
        _context = context;
        _fileService = fileService;
        _slugService = slugService;
    }

    public async Task Handle(UpdateOrganizationCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Organizations.FindAsync(new object[] { request.Id }, cancellationToken);
        if (entity == null) throw new NotFoundException(nameof(Organization), request.Id);

        entity.Name = request.Name;
        entity.Description = request.Description;
        entity.LeaderName = request.LeaderName;
        entity.Address = request.Address;
        entity.PhoneNumber = request.PhoneNumber;
        entity.Email = request.Email;
        entity.WebsiteUrl = request.WebsiteUrl;
        entity.Type = request.Type;
        entity.DisplayOrder = request.DisplayOrder;
        entity.Slug = _slugService.GenerateSlug(request.Name);

        if (request.Image != null)
        {
            if (!string.IsNullOrEmpty(entity.ImageUrl))
            {
                _fileService.DeleteFile(entity.ImageUrl);
            }
            entity.ImageUrl = await _fileService.UploadFileAsync(request.Image, "organizations");
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}