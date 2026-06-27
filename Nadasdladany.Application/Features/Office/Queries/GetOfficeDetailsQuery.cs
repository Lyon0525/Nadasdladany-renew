using MediatR;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Interfaces.Common;

namespace Nadasdladany.Application.Features.Office.Queries;

public class OfficeDetailsDto
{
    public string OfficialName { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string OpeningHoursJson { get; set; } = string.Empty;
    public List<StaffDto> Staff { get; set; } = new();
}

public class StaffDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public int Order { get; set; }
}

public record GetOfficeDetailsQuery : IRequest<OfficeDetailsDto>;

public class GetOfficeDetailsQueryHandler(IApplicationDbContext context) : IRequestHandler<GetOfficeDetailsQuery, OfficeDetailsDto>
{
    public async Task<OfficeDetailsDto> Handle(GetOfficeDetailsQuery request, CancellationToken cancellationToken)
    {
        var setting = await context.OfficeSettings.FirstOrDefaultAsync(cancellationToken);

        var staff = await context.OfficeStaff
            .OrderBy(x => x.Order)
            .Select(x => new StaffDto
            {
                Id = x.Id,
                Name = x.Name,
                Position = x.Position,
                Email = x.Email,
                Phone = x.Phone,
                Order = x.Order
            })
            .ToListAsync(cancellationToken);

        if (setting == null)
            return new OfficeDetailsDto();

        return new OfficeDetailsDto
        {
            OfficialName = setting.OfficialName,
            Address = setting.Address,
            Phone = setting.Phone,
            Email = setting.Email,
            OpeningHoursJson = setting.OpeningHoursJson,
            Staff = staff
        };
    }
}