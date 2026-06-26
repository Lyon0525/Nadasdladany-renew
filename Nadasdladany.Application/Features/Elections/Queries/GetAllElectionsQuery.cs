using MediatR;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Interfaces.Common;

namespace Nadasdladany.Application.Features.Elections.Queries;

public class ElectionDto
{
    public int Id { get; set; }
    public int Year { get; set; }
    public string Type { get; set; } = string.Empty;
    public int RegisteredVoters { get; set; }
    public int VotedCount { get; set; }
    public double TurnoutPercentage { get; set; }
    public string CandidatesJson { get; set; } = string.Empty;
}

public record GetAllElectionsQuery : IRequest<List<ElectionDto>>;

public class GetAllElectionsQueryHandler : IRequestHandler<GetAllElectionsQuery, List<ElectionDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAllElectionsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ElectionDto>> Handle(GetAllElectionsQuery request, CancellationToken cancellationToken)
    {
        return await _context.Elections
            .AsNoTracking()
            .Select(x => new ElectionDto
            {
                Id = x.Id,
                Year = x.Year,
                Type = x.Type,
                RegisteredVoters = x.RegisteredVoters,
                VotedCount = x.VotedCount,
                TurnoutPercentage = x.TurnoutPercentage,
                CandidatesJson = x.CandidatesJson
            })
            .OrderByDescending(x => x.Year)
            .ToListAsync(cancellationToken);
    }
} 