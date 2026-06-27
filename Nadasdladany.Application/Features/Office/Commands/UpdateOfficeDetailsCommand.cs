using MediatR;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Interfaces.Common;
using Nadasdladany.Domain.Entities;

namespace Nadasdladany.Application.Features.Office.Commands;

public record StaffInputDto
{
    public int? Id { get; init; }
    public required string Name { get; init; }
    public required string Position { get; init; }
    public string? Email { get; init; }
    public string? Phone { get; init; }
    public int Order { get; init; }
}

public record UpdateOfficeDetailsCommand : IRequest
{
    public required string OfficialName { get; init; }
    public required string Address { get; init; }
    public required string Phone { get; init; }
    public required string Email { get; init; }
    public required string OpeningHoursJson { get; init; }
    public List<StaffInputDto> Staff { get; init; } = new();
}

public class UpdateOfficeDetailsCommandHandler(IApplicationDbContext context) : IRequestHandler<UpdateOfficeDetailsCommand>
{
    public async Task Handle(UpdateOfficeDetailsCommand request, CancellationToken cancellationToken)
    {
        var setting = await context.OfficeSettings.FirstOrDefaultAsync(cancellationToken);
        if (setting == null)
        {
            setting = new OfficeSetting
            {
                OfficialName = request.OfficialName,
                Address = request.Address,
                Phone = request.Phone,
                Email = request.Email,
                OpeningHoursJson = request.OpeningHoursJson
            };
            context.OfficeSettings.Add(setting);
        }
        else
        {
            setting.OfficialName = request.OfficialName;
            setting.Address = request.Address;
            setting.Phone = request.Phone;
            setting.Email = request.Email;
            setting.OpeningHoursJson = request.OpeningHoursJson;
        }

        var existingStaff = await context.OfficeStaff.ToListAsync(cancellationToken);

        var incomingIds = request.Staff.Where(x => x.Id.HasValue && x.Id > 0).Select(x => x.Id.Value).ToList();
        var toRemove = existingStaff.Where(x => !incomingIds.Contains(x.Id)).ToList();

        context.OfficeStaff.RemoveRange(toRemove);

        foreach (var s in request.Staff)
        {
            if (s.Id.HasValue && s.Id > 0)
            {
                var exist = existingStaff.FirstOrDefault(x => x.Id == s.Id);
                if (exist != null)
                {
                    exist.Name = s.Name;
                    exist.Position = s.Position;
                    exist.Email = s.Email;
                    exist.Phone = s.Phone;
                    exist.Order = s.Order;
                }
            }
            else
            {
                context.OfficeStaff.Add(new OfficeStaff
                {
                    Name = s.Name,
                    Position = s.Position,
                    Email = s.Email,
                    Phone = s.Phone,
                    Order = s.Order
                });
            }
        }

        await context.SaveChangesAsync(cancellationToken);
    }
}