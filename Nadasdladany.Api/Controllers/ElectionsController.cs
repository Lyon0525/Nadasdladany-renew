using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Nadasdladany.Application.Features.Elections.Commands;
using Nadasdladany.Infrastructure.Persistence;
using System.Text.Json;

namespace Nadasdladany.Api.Controllers;

public class ElectionsController : ApiControllerBase
{
    private readonly NadasdladanyDbContext _context;

    public ElectionsController(NadasdladanyDbContext context)
    {
        _context = context;
    }

    [HttpGet("{year}")]
    public async Task<IActionResult> GetByYear(int year)
    {
        var election = await _context.Elections.AsNoTracking().FirstOrDefaultAsync(x => x.Year == year);
        if (election == null) return NotFound(new { message = "Nincs adat." });

        return Ok(new
        {
            year = election.Year,
            type = election.Type,
            registeredVoters = election.RegisteredVoters,
            votedCount = election.VotedCount,
            turnoutPercentage = election.TurnoutPercentage,
            results = JsonSerializer.Deserialize<List<CandidateInput>>(election.CandidatesJson, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase })
        });
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<int>> Create(CreateElectionResultCommand command)
    {
        return await Mediator.Send(command);
    }
}