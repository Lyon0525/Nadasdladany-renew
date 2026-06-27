using MediatR;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.VillageLocations.Commands;

public record SaveLocationCommand : IRequest<int>
{
    public int Id { get; init; }
    public required string Name { get; init; }
    public string IconType { get; init; } = "default";
    public double Latitude { get; init; }
    public double Longitude { get; init; }
    public string Address { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
}

public class SaveLocationCommandHandler(IApplicationDbContext context) : IRequestHandler<SaveLocationCommand, int>
{
    public async Task<int> Handle(SaveLocationCommand request, CancellationToken cancellationToken)
    {
        VillageLocation? location;

        if (request.Id == 0)
        {
            location = new VillageLocation();
            context.VillageLocations.Add(location);
        }
        else
        {
            location = await context.VillageLocations.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
            if (location == null) throw new KeyNotFoundException("Helyszín nem található.");
        }

        location.Name = request.Name;
        location.IconType = request.IconType;
        location.Latitude = request.Latitude;
        location.Longitude = request.Longitude;
        location.Address = request.Address;
        location.Description = request.Description;

        await context.SaveChangesAsync(cancellationToken);
        return location.Id;
    }
}