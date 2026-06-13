using MediatR;
using Nadasdladany.Application.Common.Exceptions;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.Municipality.Commands;

public record UpdateOfficeInfoCommand : IRequest
{
    public required string OfficeName { get; init; }
    public string? AboutOffice { get; init; }
    public required string Address { get; init; }
    public string? PhoneNumber { get; init; }
    public string? Email { get; init; }
    public string? WebsiteUrl { get; init; }
    public string? GoogleMapsEmbedUrl { get; init; }
}

public class UpdateOfficeInfoCommandHandler : IRequestHandler<UpdateOfficeInfoCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateOfficeInfoCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateOfficeInfoCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.OfficeInfos.FirstOrDefaultAsync(cancellationToken);

        if (entity == null)
        {
            entity = new OfficeInfo { Address = request.Address, OfficeName = request.OfficeName };
            _context.OfficeInfos.Add(entity);
        }

        entity.OfficeName = request.OfficeName;
        entity.AboutOffice = request.AboutOffice;
        entity.Address = request.Address;
        entity.PhoneNumber = request.PhoneNumber;
        entity.Email = request.Email;
        entity.WebsiteUrl = request.WebsiteUrl;
        entity.GoogleMapsEmbedUrl = request.GoogleMapsEmbedUrl;

        await _context.SaveChangesAsync(cancellationToken);
    }
}