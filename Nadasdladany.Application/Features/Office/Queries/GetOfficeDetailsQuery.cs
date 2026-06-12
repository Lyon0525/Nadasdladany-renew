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
    public string Name { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Phone { get; set; }
}

public record GetOfficeDetailsQuery : IRequest<OfficeDetailsDto>;

public class GetOfficeDetailsQueryHandler : IRequestHandler<GetOfficeDetailsQuery, OfficeDetailsDto>
{
    private readonly IApplicationDbContext _context;

    public GetOfficeDetailsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<OfficeDetailsDto> Handle(GetOfficeDetailsQuery request, CancellationToken cancellationToken)
    {
        var setting = await _context.OfficeSettings.FirstOrDefaultAsync(cancellationToken);

        var staff = await _context.OfficeStaff
            .OrderBy(x => x.Order)
            .Select(x => new StaffDto
            {
                Name = x.Name,
                Position = x.Position,
                Email = x.Email,
                Phone = x.Phone
            })
            .ToListAsync(cancellationToken);

        return new OfficeDetailsDto
        {
            OfficialName = setting?.OfficialName ?? "Úrhidai Közös Önkormányzati Hivatal Nádasdladányi Kirendeltsége",
            Address = setting?.Address ?? "8145 Nádasdladány, Fő utca 1.",
            Phone = setting?.Phone ?? "+36 (22) 590-010",
            Email = setting?.Email ?? "hivatal@nadasdladany.hu",
            OpeningHoursJson = setting?.OpeningHoursJson ?? "{\"Hétfő\":\"8:00 - 12:00, 13:00 - 16:00\",\"Kedd\":\"Nincs ügyfélfogadás\",\"Szerda\":\"8:00 - 12:00, 13:00 - 17:00\",\"Csütörtök\":\"Nincs ügyfélfogadás\",\"Péntek\":\"8:00 - 12:00\"}",
            Staff = staff.Any() ? staff : GetDefaultStaff()
        };
    }

    private List<StaffDto> GetDefaultStaff()
    {
        return new List<StaffDto>
        {
            new() { Name = "dr. Varga Gábor", Position = "Jegyző", Email = "jegyzor@urhida.hu", Phone = "+36 (22) 590-011" },
            new() { Name = "Kiss Lászlóné", Position = "Pénzügyi ügyintéző", Email = "penzugy@nadasdladany.hu" },
            new() { Name = "Németh János", Position = "Adó- és szociális ügyintéző", Email = "ado@nadasdladany.hu" }
        };
    }
}