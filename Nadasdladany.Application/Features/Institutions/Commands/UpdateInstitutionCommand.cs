using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Nadasdladany.Application.Common.Exceptions;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.Institutions.Commands;

public record UpdateInstitutionCommand : IRequest
{
    public int Id { get; init; }
    public required string Name { get; init; }
    public string? Description { get; init; }
    public string? Address { get; init; }
    public string? PhoneNumber { get; init; }
    public string? Email { get; init; }
    public string? WebsiteUrl { get; init; }
    public string? LeaderName { get; init; }
    public string? OpeningHours { get; init; }
    public string? Content { get; init; }
    public IFormFile? Image { get; init; }
    public int DisplayOrder { get; init; }
}

public class UpdateInstitutionCommandValidator : AbstractValidator<UpdateInstitutionCommand>
{
    public UpdateInstitutionCommandValidator()
    {
        RuleFor(v => v.Name).MaximumLength(150).NotEmpty();
        RuleFor(v => v.Email).EmailAddress().When(v => !string.IsNullOrEmpty(v.Email));
    }
}

public class UpdateInstitutionCommandHandler : IRequestHandler<UpdateInstitutionCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IFileService _fileService;
    private readonly ISlugService _slugService;

    public UpdateInstitutionCommandHandler(IApplicationDbContext context, IFileService fileService, ISlugService slugService)
    {
        _context = context;
        _fileService = fileService;
        _slugService = slugService;
    }

    public async Task Handle(UpdateInstitutionCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Institutions.FindAsync(new object[] { request.Id }, cancellationToken);

        if (entity == null) throw new NotFoundException(nameof(Institution), request.Id);

        entity.Name = request.Name;
        entity.Description = request.Description;
        entity.Address = request.Address;
        entity.PhoneNumber = request.PhoneNumber;
        entity.Email = request.Email;
        entity.WebsiteUrl = request.WebsiteUrl;
        entity.LeaderName = request.LeaderName;
        entity.OpeningHours = request.OpeningHours;
        entity.Content = request.Content;
        entity.DisplayOrder = request.DisplayOrder;
        entity.Slug = _slugService.GenerateSlug(request.Name);

        if (request.Image != null)
        {
            if (!string.IsNullOrEmpty(entity.ImageUrl))
            {
                _fileService.DeleteFile(entity.ImageUrl);
            }
            entity.ImageUrl = await _fileService.UploadFileAsync(request.Image, "institutions");
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}